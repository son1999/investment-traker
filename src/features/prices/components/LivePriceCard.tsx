import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLivePrice } from '@/hooks/usePrices'
import { useHoldings } from '@/hooks/usePortfolio'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Radio, Loader2 } from 'lucide-react'

export default function LivePriceCard() {
  const { t } = useTranslation()
  const { data: holdings } = useHoldings()
  const [selectedCode, setSelectedCode] = useState('')
  const [selectedType, setSelectedType] = useState<'crypto' | 'stock'>('crypto')

  const liveableAssets = (holdings || []).filter(
    (h) => h.assetType === 'crypto' || h.assetType === 'stock',
  )

  const handleSelect = (code: string) => {
    setSelectedCode(code)
    const asset = liveableAssets.find((a) => a.assetCode === code)
    if (asset) setSelectedType(asset.assetType as 'crypto' | 'stock')
  }

  const { data: livePrice, isLoading, isFetching } = useLivePrice(selectedCode, selectedType)

  return (
    <Card className="border-edge">
      <CardHeader className="border-b border-edge-subtle">
        <CardTitle className="flex items-center gap-2">
          <Radio size={16} className="text-positive" />
          {t('prices.livePrice')}
        </CardTitle>
        <CardDescription>{t('prices.livePriceDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <Select value={selectedCode} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder={t('prices.selectAsset')} />
          </SelectTrigger>
          <SelectContent>
            {liveableAssets.map((h) => (
              <SelectItem key={h.assetCode} value={h.assetCode}>
                {h.icon} {h.assetCode} ({t(`common.${h.assetType}`)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCode && (
          <div className="flex items-center justify-between rounded-lg border border-edge bg-muted/30 px-4 py-3">
            <span className="text-sm font-medium text-heading">{selectedCode}</span>
            {isLoading || isFetching ? (
              <Loader2 size={16} className="animate-spin text-caption" />
            ) : livePrice?.price != null ? (
              <span className="font-['JetBrains_Mono'] text-lg font-bold text-heading">
                {livePrice.price.toLocaleString('vi-VN')} ₫
              </span>
            ) : (
              <span className="text-sm text-caption">{t('prices.livePriceUnavailable')}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
