import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Radio } from 'lucide-react'

import { SectionCard } from '@/components/app'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useHoldings } from '@/hooks/usePortfolio'
import { useLivePrice } from '@/hooks/usePrices'

export default function LivePriceCard() {
  const { t } = useTranslation()
  const { data: holdings } = useHoldings()
  const [selectedCode, setSelectedCode] = useState('')
  const [selectedType, setSelectedType] = useState<'crypto' | 'stock' | 'metal'>('crypto')

  const liveableAssets = (holdings || []).filter(
    (holding) =>
      holding.assetType === 'crypto' ||
      holding.assetType === 'stock' ||
      holding.assetType === 'metal',
  )

  const handleSelect = (code: string | null) => {
    if (!code) return
    setSelectedCode(code)
    const asset = liveableAssets.find((holding) => holding.assetCode === code)
    if (asset) setSelectedType(asset.assetType as 'crypto' | 'stock' | 'metal')
  }

  const { data: livePrice, isLoading, isFetching } = useLivePrice(selectedCode, selectedType)

  return (
    <SectionCard
      title={
        <span className="flex items-center gap-2">
          <Radio size={16} className="text-positive" />
          {t('prices.livePrice')}
        </span>
      }
      description={t('prices.livePriceDesc')}
    >
      <Select value={selectedCode} onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('prices.selectAsset')} />
        </SelectTrigger>
        <SelectContent>
          {liveableAssets.map((holding) => (
            <SelectItem key={holding.assetCode} value={holding.assetCode}>
              {holding.icon} {holding.assetCode} ({t(`common.${holding.assetType}`)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCode ? (
        <div className="flex min-w-0 flex-col gap-2 rounded-lg border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="break-all text-sm font-medium">{selectedCode}</span>
          {isLoading || isFetching ? (
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          ) : livePrice?.price != null ? (
            <span className="min-w-0 break-all text-left font-mono text-lg font-semibold sm:text-right">
              {livePrice.currency === 'VND'
                ? `${livePrice.price.toLocaleString('vi-VN')} \u20ab`
                : `${livePrice.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })} ${livePrice.currency}`}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground sm:text-right">
              {t('prices.livePriceUnavailable')}
            </span>
          )}
        </div>
      ) : null}
    </SectionCard>
  )
}
