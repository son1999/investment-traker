import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormField, SectionCard } from '@/components/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIsGuest } from '@/hooks/useIsGuest'
import { useCreateOrUpdatePrice } from '@/hooks/usePrices'
import type { AssetType } from '@/types/api'

const typeIcons: Record<string, string> = {
  metal: '✨',
  crypto: '₿',
  stock: '📈',
}

export default function PriceForm() {
  const { t } = useTranslation()
  const isGuest = useIsGuest()
  const createPrice = useCreateOrUpdatePrice()
  const [assetType, setAssetType] = useState<AssetType>('metal')
  const [assetCode, setAssetCode] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = async () => {
    const nextPrice = parseFloat(price) || 0
    if (!assetCode || nextPrice <= 0) return

    await createPrice.mutateAsync({
      code: assetCode.toUpperCase(),
      icon: typeIcons[assetType] || '💰',
      type: assetType,
      price: nextPrice,
    })

    setAssetCode('')
    setPrice('')
  }

  if (isGuest) return null

  return (
    <SectionCard title={t('prices.newPrice')} contentClassName="space-y-0">
      <div className="grid gap-4 md:grid-cols-4">
        <FormField label={t('prices.type')}>
          <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metal">{t('common.metal')}</SelectItem>
              <SelectItem value="crypto">{t('common.crypto')}</SelectItem>
              <SelectItem value="stock">{t('common.stock')}</SelectItem>
              <SelectItem value="savings">{t('common.savings')}</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label={t('prices.code')}>
          <Input
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
            placeholder="Vd: BTC, PNJ"
            className="h-11"
          />
        </FormField>

        <FormField label={t('prices.currentPrice')}>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="h-11 font-mono"
          />
        </FormField>

        <div className="flex flex-col justify-end">
          <Button onClick={handleSubmit} disabled={createPrice.isPending} className="h-11">
            {createPrice.isPending ? '...' : t('prices.update')}
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
