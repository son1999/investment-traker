import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTransactionsUIStore } from '@/stores/transactions'
import { useCreateTransaction } from '@/hooks/useTransactions'
import { useAssets } from '@/hooks/useAssets'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { TransactionAction } from '@/types/api'

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

  const [selectedAssetCode, setSelectedAssetCode] = useState('')
  const [action, setAction] = useState<TransactionAction>('MUA')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const selectedAsset = (assets || []).find((a) => a.code === selectedAssetCode)
  const currency = selectedAsset?.currency || 'VND'
  const total = useMemo(() => parseNum(quantity) * parseNum(unitPrice), [quantity, unitPrice])

  const handleSave = async () => {
    const qty = parseNum(quantity)
    const price = parseNum(unitPrice)
    if (!selectedAsset || qty <= 0 || price <= 0) return
    await createTx.mutateAsync({
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      assetType: selectedAsset.type,
      assetCode: selectedAsset.code,
      action,
      quantity: qty,
      unitPrice: price,
      note,
      icon: selectedAsset.icon,
      iconBg: selectedAsset.iconBg,
    })
    setSelectedAssetCode(''); setQuantity(''); setUnitPrice(''); setDate(''); setNote('')
    setShowForm(false)
  }

  const assetItems = assets || []
  const noAssets = assetItems.length === 0

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
                    <span>{selectedAsset.currency || 'VND'}</span>
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

            {/* Row 2: Quantity, Price, Date */}
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label className="text-[11px] uppercase tracking-wider">{t('transactions.quantity')}</Label>
                <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0.00" className="h-9 font-['JetBrains_Mono']" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-[11px] uppercase tracking-wider">{t('transactions.unitPrice')} ({currency})</Label>
                <Input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0" className="h-9 font-['JetBrains_Mono']" />
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

            {/* Total */}
            <div className="flex items-center justify-between rounded-lg border border-edge bg-muted/50 p-4">
              <span className="text-sm text-muted-foreground">{t('transactions.totalValue')}</span>
              <span className="font-['JetBrains_Mono'] text-xl font-bold text-heading">{formatCurrency(total, currency)}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <Button onClick={handleSave} disabled={createTx.isPending || !selectedAsset} size="lg">
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
