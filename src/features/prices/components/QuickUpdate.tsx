import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SectionCard } from '@/components/app'
import { Button } from '@/components/ui/button'
import { PriceInputDialog } from '@/components/ui/price-input-dialog'
import { Separator } from '@/components/ui/separator'
import { useHoldings } from '@/hooks/usePortfolio'
import { useUpdatePriceByCode } from '@/hooks/usePrices'

export default function QuickUpdate() {
  const { t } = useTranslation()
  const { data: holdings } = useHoldings()
  const updatePrice = useUpdatePriceByCode()
  const items = holdings || []
  const [updatingCode, setUpdatingCode] = useState<string | null>(null)

  const handleSubmitPrice = (price: number) => {
    if (!updatingCode) return
    updatePrice.mutate({ code: updatingCode, price })
    setUpdatingCode(null)
  }

  return (
    <>
      <SectionCard
        title={t('prices.quickUpdate')}
        description={t('prices.selectFromHoldings')}
        contentClassName="space-y-0"
      >
        {items.map((holding, idx) => (
          <div key={holding.assetCode}>
            <div className="flex min-w-0 flex-col gap-3 rounded-lg px-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-lg">
                  {holding.icon}
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="break-all text-sm font-semibold">{holding.assetCode}</span>
                  <span className="break-words text-[11px] text-muted-foreground">
                    {t('prices.cost')}{' '}
                    <span className="font-mono">{holding.averageCost.toLocaleString('vi-VN')}</span>
                    {' · '}
                    {t('prices.current')}: <span className="font-mono">{holding.currentPrice.toLocaleString('vi-VN')}</span>
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUpdatingCode(holding.assetCode)}
                disabled={updatePrice.isPending}
                className="w-full sm:w-auto"
              >
                {t('common.update')}
              </Button>
            </div>
            {idx < items.length - 1 ? <Separator className="my-1" /> : null}
          </div>
        ))}
      </SectionCard>

      <PriceInputDialog
        open={!!updatingCode}
        onOpenChange={(open) => {
          if (!open) setUpdatingCode(null)
        }}
        title={`${t('prices.quickUpdate')} - ${updatingCode}`}
        description={t('prices.quickUpdateDesc')}
        label={t('prices.currentPrice')}
        onSubmit={handleSubmitPrice}
        isPending={updatePrice.isPending}
        submitLabel={t('common.update')}
        cancelLabel={t('common.cancel')}
      />
    </>
  )
}
