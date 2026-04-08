import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTransactionsUIStore } from '@/stores/transactions'
import { useCreateTransaction } from '@/hooks/useTransactions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AssetType, TransactionAction } from '@/types/api'

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' ₫'
}

const assetTypeIcons: Record<string, { icon: string; iconBg: string }> = {
  metal: { icon: '🥇', iconBg: 'rgba(248,160,16,0.2)' },
  crypto: { icon: '₿', iconBg: '#3b3b3e' },
  stock: { icon: '📈', iconBg: '#3b3b3e' },
}

export default function TransactionForm() {
  const { t } = useTranslation()
  const { setShowForm } = useTransactionsUIStore()
  const createTx = useCreateTransaction()

  const [assetType, setAssetType] = useState<AssetType>('metal')
  const [assetCode, setAssetCode] = useState('')
  const [action, setAction] = useState<TransactionAction>('MUA')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const total = useMemo(() => (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0), [quantity, unitPrice])

  const handleSave = async () => {
    const qty = parseFloat(quantity) || 0
    const price = parseFloat(unitPrice) || 0
    if (!assetCode || qty <= 0 || price <= 0) return
    const icons = assetTypeIcons[assetType] || { icon: '💰', iconBg: '#3b3b3e' }
    await createTx.mutateAsync({
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      assetType, assetCode: assetCode.toUpperCase(), action, quantity: qty, unitPrice: price, note, ...icons,
    })
    setAssetCode(''); setQuantity(''); setUnitPrice(''); setDate(''); setNote('')
    setShowForm(false)
  }

  return (
    <Card className="border-edge-subtle shadow-lg">
      <CardHeader>
        <CardTitle>{t('transactions.newTitle')}</CardTitle>
        <CardDescription className="uppercase tracking-wider">{t('transactions.newSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('transactions.assetType')}</Label>
            <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="metal">{t('common.metal')}</SelectItem>
                <SelectItem value="crypto">{t('common.crypto')}</SelectItem>
                <SelectItem value="stock">{t('common.stock')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('transactions.assetCode')}</Label>
            <Input value={assetCode} onChange={(e) => setAssetCode(e.target.value)} placeholder="SJC, BTC, VNM..." className="h-9" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('transactions.action')}</Label>
            <Select value={action} onValueChange={(v) => setAction(v as TransactionAction)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MUA">{t('common.buy')}</SelectItem>
                <SelectItem value="BAN">{t('common.sell')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('transactions.quantity')}</Label>
            <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0.00" className="h-9 font-['JetBrains_Mono']" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('transactions.unitPrice')}</Label>
            <Input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0" className="h-9 font-['JetBrains_Mono']" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('transactions.date')}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-[11px] uppercase tracking-wider">{t('transactions.note')}</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('transactions.notePlaceholder')} className="h-9" />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-edge bg-muted/50 p-4">
          <span className="text-sm text-caption">{t('transactions.totalValue')}</span>
          <span className="font-['JetBrains_Mono'] text-xl font-bold text-heading">{formatVND(total)}</span>
        </div>

        <div className="flex gap-4 pt-2">
          <Button onClick={handleSave} disabled={createTx.isPending} size="lg">
            {createTx.isPending ? '...' : t('transactions.save')}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setShowForm(false)}>
            {t('transactions.cancel')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
