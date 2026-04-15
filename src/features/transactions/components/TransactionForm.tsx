import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { EmptyState, FormField, SectionCard } from '@/components/app'
import { AssetIcon } from '@/components/ui/asset-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAssets } from '@/hooks/useAssets'
import { useCurrencies } from '@/hooks/useCurrencies'
import { useCreateSavingsEvent } from '@/hooks/useSavingsEvents'
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions'
import { formatMoney, parseMoney } from '@/lib/format'
import { useTransactionsUIStore } from '@/stores/transactions'
import type { AssetType, SavingsEventType, TransactionAction } from '@/types/api'

type InputMode = 'totalAmount' | 'unitPrice'

const defaultModeByType: Record<AssetType, InputMode> = {
  crypto: 'totalAmount',
  metal: 'totalAmount',
  savings: 'totalAmount',
  stock: 'unitPrice',
}

function parseNum(s: string): number {
  return parseFloat(s.replace(/,/g, '')) || 0
}

function formatNumberInput(raw: string): string {
  let cleaned = raw.replace(/[^\d.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '')
  }
  const [intPart, decPart] = cleaned.split('.')
  const withSep =
    intPart && intPart !== ''
      ? Number(intPart).toLocaleString('en-US', { maximumFractionDigits: 0 })
      : ''
  return decPart !== undefined ? `${withSep}.${decPart}` : withSep
}

function formatNumberDisplay(value: number): string {
  if (!Number.isFinite(value) || value === 0) return ''
  return value.toLocaleString('en-US', { maximumFractionDigits: 8 })
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'VND') return `${amount.toLocaleString('vi-VN')} ₫`
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })} ${currency}`
}

export default function TransactionForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setShowForm, editingTx, cancelEdit } = useTransactionsUIStore()
  const createTx = useCreateTransaction()
  const updateTx = useUpdateTransaction()
  const createSavingsEvent = useCreateSavingsEvent()
  const isEdit = Boolean(editingTx)
  const { data: assets } = useAssets()
  const { data: currencies } = useCurrencies()

  const [selectedAssetCode, setSelectedAssetCode] = useState('')
  const [action, setAction] = useState<TransactionAction>('MUA')
  const [inputMode, setInputMode] = useState<InputMode>('totalAmount')
  const [quantity, setQuantity] = useState('')
  const [priceInput, setPriceInput] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [savingsEventType, setSavingsEventType] = useState<SavingsEventType>('DEPOSIT')
  const [savingsAmount, setSavingsAmount] = useState('')

  useEffect(() => {
    if (!editingTx) return
    setSelectedAssetCode(editingTx.assetCode)
    setAction(editingTx.action)
    setInputMode('unitPrice')
    setQuantity(formatNumberDisplay(editingTx.quantity))
    setPriceInput(formatNumberDisplay(editingTx.unitPrice))
    setDate(editingTx.date.slice(0, 10))
    setNote(editingTx.note || '')
  }, [editingTx])

  const selectedAsset = (assets || []).find((asset) => asset.code === selectedAssetCode)
  const currency = selectedAsset?.currency || 'VND'
  const isSavings = selectedAsset?.type === 'savings'

  const rateMap: Record<string, number> = { VND: 1 }
  for (const current of currencies || []) {
    rateMap[current.code] = current.rateToVnd
  }
  const rate = rateMap[currency] || 1
  const isVND = currency === 'VND'

  const qty = parseNum(quantity)
  const priceVal = parseNum(priceInput)

  const computed = useMemo(() => {
    if (qty <= 0 || priceVal <= 0) return null
    if (inputMode === 'totalAmount') {
      const totalAmount = priceVal
      const unitPrice = totalAmount / qty
      const totalVnd = totalAmount * rate
      return { totalAmount, unitPrice, totalVnd }
    }

    const unitPrice = priceVal
    const totalAmount = qty * unitPrice
    const totalVnd = totalAmount * rate
    return { totalAmount, unitPrice, totalVnd }
  }, [inputMode, priceVal, qty, rate])

  const handleSave = async () => {
    if (!selectedAsset) return

    if (isSavings) {
      const amount = parseFloat(savingsAmount)
      if (!amount || amount <= 0) return
      await createSavingsEvent.mutateAsync({
        assetCode: selectedAsset.code,
        type: savingsEventType,
        amount,
        date: date || new Date().toISOString().slice(0, 10),
        note: note || undefined,
      })
      setSelectedAssetCode('')
      setSavingsAmount('')
      setDate('')
      setNote('')
      setShowForm(false)
      return
    }

    if (qty <= 0 || priceVal <= 0) return

    const base = {
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      assetType: selectedAsset.type,
      assetCode: selectedAsset.code,
      action,
      quantity: qty,
      note,
      icon: selectedAsset.icon,
      iconBg: selectedAsset.iconBg,
    }

    if (isEdit && editingTx) {
      const updateData = {
        date: base.date,
        action,
        quantity: qty,
        note,
        ...(inputMode === 'totalAmount'
          ? { totalAmount: priceVal }
          : { unitPrice: priceVal }),
      }
      await updateTx.mutateAsync({ id: editingTx.id, data: updateData })
    } else {
      const createData =
        inputMode === 'totalAmount'
          ? { ...base, totalAmount: priceVal }
          : { ...base, unitPrice: priceVal }
      await createTx.mutateAsync(createData)
    }

    setSelectedAssetCode('')
    setQuantity('')
    setPriceInput('')
    setDate('')
    setNote('')
    if (isEdit) {
      cancelEdit()
    } else {
      setShowForm(false)
    }
  }

  const assetItems = assets || []

  const handleAssetChange = (value: string) => {
    setSelectedAssetCode(value)
    const nextAsset = assetItems.find((asset) => asset.code === value)
    if (nextAsset) {
      setInputMode(defaultModeByType[nextAsset.type])
      setPriceInput('')
    }
  }

  return (
    <SectionCard
      title={isEdit ? t('transactions.editTitle') : t('transactions.newTitle')}
      description={isEdit ? t('transactions.editSubtitle') : t('transactions.newSubtitle')}
      className="shadow-sm"
      contentClassName="space-y-6"
    >
      {assetItems.length === 0 ? (
        <EmptyState
          description={t('assets.noAssets')}
          action={
            <Button variant="outline" size="sm" onClick={() => navigate('/assets')}>
              {t('assets.addAsset')}
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label={t('transactions.assetCode')} className="md:col-span-2">
              <Select value={selectedAssetCode} onValueChange={(v) => v && handleAssetChange(v)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={t('transactions.assetCode')} />
                </SelectTrigger>
                <SelectContent>
                  {assetItems.map((asset) => (
                    <SelectItem key={asset.code} value={asset.code}>
                      <div className="flex items-center gap-2">
                        <AssetIcon
                          code={asset.code}
                          assetType={asset.type}
                          fallback={asset.icon}
                          fallbackBg={asset.iconBg}
                          sizeClass="size-5"
                        />
                        <span>
                          {asset.code} - {asset.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAsset ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="uppercase">
                    {t(`common.${selectedAsset.type}`)}
                  </Badge>
                  <span>{currency}</span>
                </div>
              ) : null}
            </FormField>

            <FormField label={t('transactions.action')}>
              {isSavings ? (
                <Select
                  value={savingsEventType}
                  onValueChange={(v) => v && setSavingsEventType(v as SavingsEventType)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEPOSIT">{t('savings.deposit')}</SelectItem>
                    <SelectItem value="WITHDRAW">{t('savings.withdraw')}</SelectItem>
                    <SelectItem value="INTEREST">{t('savings.interest')}</SelectItem>
                    <SelectItem value="FEE">{t('savings.fee')}</SelectItem>
                    <SelectItem value="MATURITY">{t('savings.maturity')}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select value={action} onValueChange={(v) => v && setAction(v as TransactionAction)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MUA">{t('common.buy')}</SelectItem>
                    <SelectItem value="BAN">{t('common.sell')}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </FormField>
          </div>

          {isSavings ? (
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label={t('savings.amount')}>
                <Input
                  value={formatMoney(savingsAmount)}
                  onChange={(e) => setSavingsAmount(parseMoney(e.target.value))}
                  placeholder="VD: 10,000,000"
                  inputMode="numeric"
                  className="h-10 font-mono"
                />
              </FormField>
              <FormField label={t('transactions.date')}>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10"
                />
              </FormField>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('transactions.inputMode')}</p>
                <Tabs
                  value={inputMode}
                  onValueChange={(value) => {
                    setInputMode(value as InputMode)
                    setPriceInput('')
                  }}
                >
                  <TabsList className="h-auto flex-wrap">
                    <TabsTrigger value="totalAmount">{t('transactions.totalAmount')}</TabsTrigger>
                    <TabsTrigger value="unitPrice">{t('transactions.unitPriceLabel')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField label={t('transactions.quantity')}>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(formatNumberInput(e.target.value))}
                    placeholder="0.00"
                    inputMode="decimal"
                    className="h-10 font-mono"
                  />
                </FormField>
                <FormField
                  label={`${inputMode === 'totalAmount' ? t('transactions.totalAmount') : t('transactions.unitPriceLabel')} (${currency})`}
                >
                  <Input
                    value={priceInput}
                    onChange={(e) => setPriceInput(formatNumberInput(e.target.value))}
                    placeholder="0"
                    inputMode="decimal"
                    className="h-10 font-mono"
                  />
                </FormField>
                <FormField label={t('transactions.date')}>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-10"
                  />
                </FormField>
              </div>
            </>
          )}

          {/* <FormField label={t('transactions.note')} description="Optional"> */}
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('transactions.notePlaceholder')}
              className="h-10"
            />
          {/* </FormField> */}

          {!isSavings ? <Separator /> : null}

          {!isSavings ? (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-sm text-muted-foreground">{t('transactions.totalValue')}</span>
                <span className="font-mono text-xl font-semibold text-foreground">
                  {formatCurrency(computed?.totalAmount || 0, currency)}
                </span>
              </div>
              {computed ? (
                <div className="mt-3 space-y-2">
                  <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-muted-foreground">
                      {inputMode === 'totalAmount'
                        ? t('transactions.unitPriceCalc')
                        : t('transactions.unitPriceLabel')}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatCurrency(computed.unitPrice, currency)}/{selectedAsset?.code}
                    </span>
                  </div>
                  {!isVND ? (
                    <div className="flex flex-col gap-1 border-t pt-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <span className="text-muted-foreground">{t('transactions.convertVnd')}</span>
                      <span className="font-mono font-medium">
                        ≈ {computed.totalVnd.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} ₫
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={
                createTx.isPending ||
                updateTx.isPending ||
                createSavingsEvent.isPending ||
                !selectedAsset ||
                (isSavings ? !parseFloat(savingsAmount) : !computed)
              }
              size="lg"
            >
              {createTx.isPending || updateTx.isPending || createSavingsEvent.isPending
                ? '...'
                : t('transactions.save')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => (isEdit ? cancelEdit() : setShowForm(false))}
            >
              {t('transactions.cancel')}
            </Button>
          </div>
        </>
      )}
    </SectionCard>
  )
}
