import { useTranslation } from 'react-i18next'

import { useDCAChart } from '@/hooks/useReports'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DCAHeroChart({ code }: { code: string }) {
  const { t } = useTranslation()
  const { data } = useDCAChart(code)

  if (!data) return null

  const barHeights = data.purchaseAmounts
  const maxBar = Math.max(...barHeights, 1)
  const currentPricePct =
    data.avgCostPrices.length > 0
      ? Math.min(95, (data.currentPrice / Math.max(...data.avgCostPrices)) * 65)
      : 65

  const stats = [
    { label: t('reports.numPurchases'), value: String(data.numPurchases) },
    { label: t('reports.avgInterval'), value: `${data.avgIntervalDays} ngay` },
    {
      label: t('reports.avgPerPurchase'),
      value: `${(data.avgPerPurchase / 1e6).toFixed(1)} tr VND`,
    },
  ]

  return (
    <Card className="w-full min-w-0 border-border">
      <CardHeader className="flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-sm">{t('reports.dca')}</CardTitle>
          <CardDescription>{t('reports.dcaSub')}</CardDescription>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-5 md:justify-end">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-[96px] flex-col gap-0.5 md:items-end">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </span>
              <span className="font-mono text-base font-semibold text-foreground">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="min-w-0 space-y-5">
        <div className="relative flex h-44 min-w-0 items-end pt-2 sm:h-50">
          <div className="flex min-w-0 flex-1 items-end justify-between gap-1.5 px-2 sm:gap-2 sm:px-8 lg:px-12">
            {barHeights.map((height, index) => (
              <div
                key={index}
                className="relative flex-1 rounded-t bg-muted-foreground/20"
                style={{ height: `${(height / maxBar) * 170}px` }}
              >
                <div className="absolute left-0 right-0 top-0 h-0.5 rounded-full bg-gold" />
              </div>
            ))}
          </div>

          <div
            className="absolute left-2 right-2 border-t border-dashed border-positive/50 sm:left-8 sm:right-8 lg:left-12 lg:right-12"
            style={{ bottom: `${currentPricePct}%` }}
          >
            <span className="absolute -top-2 right-0 bg-card px-1.5 text-[10px] text-positive">
              {t('reports.currentPrice')}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-2 sm:gap-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-muted-foreground/20" />
            <span className="text-[11px] text-muted-foreground">{t('reports.purchaseAmount')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-3 rounded-full bg-gold" />
            <span className="text-[11px] text-muted-foreground">{t('reports.avgCostPrice')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-px w-3 border-t border-dashed border-positive" />
            <span className="text-[11px] text-muted-foreground">{t('reports.currentPrice')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
