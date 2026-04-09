import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTransactionsUIStore } from '@/stores/transactions'
import { useCreateTransaction } from '@/hooks/useTransactions'
import { useAssets } from '@/hooks/useAssets'
import { useCurrencies } from '@/hooks/useCurrencies'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { TransactionAction, AssetType } from '@/types/api'

type InputMode = 'totalAmount' | 'unitPrice'

const defaultModeByType: Record<AssetType, InputMode> = {
  crypto: 'totalAmount',
  metal: 'totalAmount',
  savings: 'totalAmount',
  stock: 'unitPrice',
}

function parseNum(s: string): number {
  return parseFloat(s.replace(/,/g, '.')) || 0
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'VND') return amount.toLocaleString('vi-VN') + ' ₫'
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) + ' ' + currency
}

export default function TransactionForm() {
  const { t } = useTranslation()
  const { setShowForm } = useTransactionsUIStore()
  const createTx = useCreateTransaction()
  const { data: assets } = useAssets()
  const { data: currencies } = useCurrencies()

  const [selectedAssetCode, setSelectedAssetCode] = useState('')
  const [action, setAction] = useState<TransactionAction>('MUA')
  const [inputMode, setInputMode] = useState<InputMode>('totalAmount')
  const [quantity, setQuantity] = useState('')
  const [priceInput, setPriceInput] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const selectedAsset = (assets || []).find((a) => a.code === selectedAssetCode)
  const currency = selectedAsset?.currency || 'VND'

  // Build rateToVnd lookup
  const rateMap: Record<string, number> = { VND: 1 }
  for (const c of currencies || []) {
    rateMap[c.code] = c.rateToVnd
  }
  const rate = rateMap[currency] || 1
  const isVND = currency === 'VND'

  // Auto-set input mode when asset changes
  useEffect(() => {
    if (selectedAsset) {
      setInputMode(defaultModeByType[selectedAsset.type])
      setPriceInput('')
    }
  }, [selectedAssetCode])

  // Calculations
  const qty = parseNum(quantity)
  const priceVal = parseNum(priceInput)

  const computed = useMemo(() => {
    if (qty <= 0 || priceVal <= 0) return null
    if (inputMode === 'totalAmount') {
      const totalAmount = priceVal
      const unitPrice = totalAmount / qty
      const totalVnd = totalAmount * rate
      return { totalAmount, unitPrice, totalVnd }
    } else {
      const unitPrice = priceVal
      const totalAmount = qty * unitPrice
      const totalVnd = totalAmount * rate
      return { totalAmount, unitPrice, totalVnd }
    }
  }, [qty, priceVal, inputMode, rate])

  const handleSave = async () => {
    if (!selectedAsset || qty <= 0 || priceVal <= 0) return

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

    if (inputMode === 'totalAmount') {
      await createTx.mutateAsync({ ...base, totalAmount: priceVal })
    } else {
      await createTx.mutateAsync({ ...base, unitPrice: priceVal })
    }

    setSelectedAssetCode(''); setQuantity(''); setPriceInput(''); setDate(''); setNote('')
    setShowForm(false)
  }

  const assetItems = assets || []
  const noAssets = assetItems.length === 0

  const priceLabel = inputMode === 'totalAmount'
    ? `${t('transactions.totalAmount')} (${currency})`
    : `${t('transactions.unitPriceLabel')} (${currency})`

  return (
    <Card className="border-edge-subtle shadow-lg">
      <CardHeader>
        <CardTitle>{t('transactions.newTitle')}</CardTitle>
        <CardDescription className="uppercase tracking-wider">{t('transactions.newSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {noAssets ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">{t('assets.noAssets')}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/assets'}>
              {t('assets.addAsset')}
            </Button>
          </div>
        ) : (
          <>
            {/* Row 1: Asset + Action */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 flex flex-col gap-2">
                <Label className="text-[11px] uppercase tracking-wider">{t('transactions.assetCode')}</Label>
                <Select value={selectedAssetCode} onValueChange={(v) => v && setSelectedAssetCode(v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t('transactions.assetCode')} />
                  </SelectTrigger>
                  <SelectContent>
                    {assetItems.map((asset) => (
                      <SelectItem key={asset.code} value={asset.code}>
                        {asset.icon} {asset.code} — {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedAsset && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[9px] uppercase">{t(`common.${selectedAsset.type}`)}</Badge>
                    <span>{currency}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[11px] uppercase tracking-wider">{t('transactions.action')}</Label>
                <Select value={action} onValueChange={(v) => v && setAction(v as TransactionAction)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MUA">{t('common.buy')}</SelectItem>
                    <SelectItem value="BAN">{t('common.sell')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Input mode toggle */}
            <div className="flex items-center gap-4">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{t('transactions.inputMode')}</Label>
              <div className="flex gap-1 rounded-lg border border-edge bg-muted/30 p-0.5">
                <button
                  type="button"
                  onClick={() => { setInputMode('totalAmount'); setPriceInput('') }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    inputMode === 'totalAmount'
                      ? 'bg-background text-heading shadow-sm'
                      : 'text-caption hover:text-heading'
                  }`}
                >
                  {t('transactions.totalAmount')}
                </button>
                <button
                  type="button"
                  onClick={() => { setInputMode('unitPrice'); setPriceInput('') }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    inputMode === 'unitPrice'
                      ? 'bg-background text-heading shadow-sm'
                      : 'text-caption hover:text-heading'
                  }`}
                >
                  {t('transactions.unitPriceLabel')}
                </button>
              </div>
            </div>

            {/* Row 3: Quantity, Price/Total, Date */}
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label className="text-[11px] uppercase tracking-wider">{t('transactions.quantity')}</Label>
                <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0.00" className="h-9 font-['JetBrains_Mono']" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-[11px] uppercase tracking-wider">{priceLabel}</Label>
                <Input value={priceInput} onChange={(e) => setPriceInput(e.target.value)} placeholder="0" className="h-9 font-['JetBrains_Mono']" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-[11px] uppercase tracking-wider">{t('transactions.date')}</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9" />
              </div>
            </div>

            {/* Note (optional) */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t('transactions.note')} <span className="normal-case tracking-normal">(optional)</span>
              </Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('transactions.notePlaceholder')} className="h-9" />
            </div>

            <Separator />

            {/* Summary panel */}
            {computed && (
              <div className="flex flex-col gap-2 rounded-lg border border-edge bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('transactions.totalValue')}</span>
                  <span className="font-['JetBrains_Mono'] text-xl font-bold text-heading">
                    {formatCurrency(computed.totalAmount, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-caption">
                    {inputMode === 'totalAmount' ? t('transactions.unitPriceCalc') : t('transactions.unitPriceLabel')}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-sm text-caption">
                    {formatCurrency(computed.unitPrice, currency)}/{selectedAsset?.code}
                  </span>
                </div>
                {!isVND && (
                  <div className="flex items-center justify-between border-t border-edge-subtle pt-2">
                    <span className="text-xs text-caption">{t('transactions.convertVnd')}</span>
                    <span className="font-['JetBrains_Mono'] text-sm font-medium text-heading">
                      ≈ {Math.round(computed.totalVnd).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                )}
              </div>
            )}

            {!computed && (
              <div className="flex items-center justify-between rounded-lg border border-edge bg-muted/50 p-4">
                <span className="text-sm text-muted-foreground">{t('transactions.totalValue')}</span>
                <span className="font-['JetBrains_Mono'] text-xl font-bold text-heading">{formatCurrency(0, currency)}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <Button onClick={handleSave} disabled={createTx.isPending || !selectedAsset || !computed} size="lg">
                {createTx.isPending ? '...' : t('transactions.save')}
              </Button>
              <Button variant="outline" size="lg" onClick={() => setShowForm(false)}>
                {t('transactions.cancel')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
