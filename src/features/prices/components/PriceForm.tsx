import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateOrUpdatePrice } from '@/hooks/usePrices'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIsGuest } from '@/hooks/useIsGuest'
import type { AssetType } from '@/types/api'

const typeIcons: Record<string, string> = { metal: '✨', crypto: '₿', stock: '📈' }

export default function PriceForm() {
  const { t } = useTranslation()
  const isGuest = useIsGuest()
  const createPrice = useCreateOrUpdatePrice()
  const [assetType, setAssetType] = useState<AssetType>('metal')
  const [assetCode, setAssetCode] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = async () => {
    const p = parseFloat(price) || 0
    if (!assetCode || p <= 0) return
    await createPrice.mutateAsync({ code: assetCode.toUpperCase(), icon: typeIcons[assetType] || '💰', type: assetType, price: p })
    setAssetCode(''); setPrice('')
  }

  if (isGuest) return null

  return (
    <Card className="border-edge shadow-sm">
      <CardHeader><CardTitle>{t('prices.newPrice')}</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('prices.type')}</Label>
            <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
              <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="metal">{t('common.metal')}</SelectItem>
                <SelectItem value="crypto">{t('common.crypto')}</SelectItem>
                <SelectItem value="stock">{t('common.stock')}</SelectItem>
                <SelectItem value="savings">{t('common.savings')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('prices.code')}</Label>
            <Input value={assetCode} onChange={(e) => setAssetCode(e.target.value)} placeholder="Vd: BTC, PNJ" className="h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] uppercase tracking-wider">{t('prices.currentPrice')}</Label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className="h-11 font-['JetBrains_Mono']" />
          </div>
          <div className="flex flex-col justify-end">
            <Button onClick={handleSubmit} disabled={createPrice.isPending} className="h-11">
              {createPrice.isPending ? '...' : t('prices.update')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
