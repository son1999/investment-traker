import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHoldings } from '@/hooks/usePortfolio'
import { useUpdatePriceByCode } from '@/hooks/usePrices'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PriceInputDialog } from '@/components/ui/price-input-dialog'

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
      <Card className="border-edge">
        <CardHeader className="border-b border-edge-subtle">
          <CardTitle>{t('prices.quickUpdate')}</CardTitle>
          <CardDescription>{t('prices.selectFromHoldings')}</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          {items.map((h, idx) => (
            <div key={h.assetCode}>
              <div className="flex items-center justify-between rounded px-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded bg-muted text-lg">{h.icon}</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-heading">{h.assetCode}</span>
                    <span className="text-[11px] text-caption">
                      {t('prices.cost')} <span className="font-['JetBrains_Mono']">{h.averageCost.toLocaleString('vi-VN')}</span>
                      {' · ' + t('prices.current') + ': '}<span className="font-['JetBrains_Mono']">{h.currentPrice.toLocaleString('vi-VN')}</span>
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setUpdatingCode(h.assetCode)} disabled={updatePrice.isPending}>
                  {t('common.update')}
                </Button>
              </div>
              {idx < items.length - 1 && <Separator className="mx-4 opacity-20" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <PriceInputDialog
        open={!!updatingCode}
        onOpenChange={(open) => { if (!open) setUpdatingCode(null) }}
        title={`${t('prices.quickUpdate')} — ${updatingCode}`}
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
