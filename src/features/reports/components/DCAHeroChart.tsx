import { useTranslation } from 'react-i18next'
import { useDCAChart } from '@/hooks/useReports'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function DCAHeroChart({ code }: { code: string }) {
  const { t } = useTranslation()
  const { data } = useDCAChart(code)
  if (!data) return null

  const barHeights = data.purchaseAmounts
  const maxBar = Math.max(...barHeights, 1)
  const currentPricePct = data.avgCostPrices.length > 0 ? Math.min(95, (data.currentPrice / Math.max(...data.avgCostPrices) * 65)) : 65

  const stats = [
    { label: t('reports.numPurchases'), value: String(data.numPurchases) },
    { label: t('reports.avgInterval'), value: `${data.avgIntervalDays} ngày` },
    { label: t('reports.avgPerPurchase'), value: `${(data.avgPerPurchase / 1e6).toFixed(1)} tr ₫` },
  ]

  return (
    <Card className="border-edge">
      <CardHeader className="flex-row items-start justify-between">
        <div><CardTitle className="text-sm">{t('reports.dca')}</CardTitle><CardDescription>{t('reports.dcaSub')}</CardDescription></div>
        <div className="flex gap-5">{stats.map(s => (
          <div key={s.label} className="flex flex-col items-end gap-0.5"><span className="text-[10px] uppercase tracking-wide text-caption">{s.label}</span><span className="font-mono text-base font-semibold text-heading">{s.value}</span></div>
        ))}</div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="relative flex h-50 items-end pt-2">
          <div className="flex flex-1 items-end justify-between gap-2 px-12">
            {barHeights.map((h, i) => (<div key={i} className="relative flex-1 rounded-t bg-muted-foreground/20" style={{ height: `${(h / maxBar) * 170}px` }}><div className="absolute left-0 right-0 top-0 h-0.5 rounded-full bg-gold" /></div>))}
          </div>
          <div className="absolute left-12 right-12 border-t border-dashed border-positive/50" style={{ bottom: `${currentPricePct}%` }}>
            <span className="absolute -top-2 right-0 bg-card px-1.5 text-[10px] text-positive">{t('reports.currentPrice')}</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-12">
          <div className="flex gap-5">
            <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-muted-foreground/20" /><span className="text-[11px] text-caption">{t('reports.purchaseAmount')}</span></div>
            <div className="flex items-center gap-1.5"><div className="h-0.5 w-3 rounded-full bg-gold" /><span className="text-[11px] text-caption">{t('reports.avgCostPrice')}</span></div>
            <div className="flex items-center gap-1.5"><div className="h-px w-3 border-t border-dashed border-positive" /><span className="text-[11px] text-caption">{t('reports.currentPrice')}</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
