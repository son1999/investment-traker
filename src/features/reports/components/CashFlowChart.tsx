import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCashFlow } from '@/hooks/useReports'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Period } from '@/types/api'
import { formatCurrency } from '@/lib/format'

export default function CashFlowChart({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = useCashFlow(period)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  if (isLoading) return <Skeleton className="h-64 rounded-lg" />

  const months = data || []
  const maxVal = Math.max(...months.map((m) => Math.max(m.inflow, m.outflow)), 1)
  const hovered = hoverIndex != null ? months[hoverIndex] : null
  const tooltipLeftPct =
    months.length > 1 && hoverIndex != null
      ? ((hoverIndex + 0.5) / months.length) * 100
      : 50
  const clampedTooltipLeftPct = Math.min(Math.max(tooltipLeftPct, 14), 86)
  const chartMinWidth = Math.max(months.length * 58, 420)

  return (
    <Card className="w-full min-w-0 border-border">
      <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-sm">{t('reports.cashFlow')}</CardTitle>
          <CardDescription>{t('reports.cashFlowSub')}</CardDescription>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-5">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-positive/60" />
            <span className="text-[11px] text-muted-foreground">{t('reports.inflow')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-destructive/60" />
            <span className="text-[11px] text-muted-foreground">{t('reports.outflow')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="relative pt-12">
          {hovered ? (
            <div
              className="air-tooltip-pop pointer-events-none absolute top-0 z-20 max-w-[calc(100%-1rem)] -translate-x-1/2 rounded-md border bg-popover px-2.5 py-1.5 text-[11px] leading-tight shadow-md"
              style={{ left: `${clampedTooltipLeftPct}%` }}
            >
              <div className="mb-1 font-medium text-muted-foreground">{hovered.month}</div>
              <div className="flex flex-col gap-0.5 font-['JetBrains_Mono']">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block size-2 rounded-sm bg-positive" />
                    <span className="text-muted-foreground">{t('reports.inflow')}</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(hovered.inflow)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block size-2 rounded-sm bg-destructive" />
                    <span className="text-muted-foreground">{t('reports.outflow')}</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(hovered.outflow)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 border-t pt-1">
                  <span className="text-muted-foreground">Net</span>
                  <span
                    className={`font-semibold ${hovered.inflow - hovered.outflow >= 0 ? 'text-positive' : 'text-negative'}`}
                  >
                    {hovered.inflow - hovered.outflow > 0 ? '+' : ''}
                    {formatCurrency(hovered.inflow - hovered.outflow)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="w-full min-w-0 overflow-x-auto">
            <div className="flex items-end gap-3 px-2 sm:gap-5" style={{ minWidth: `${chartMinWidth}px` }}>
              {months.map((m, index) => {
                const isHover = hoverIndex === index
                return (
                  <div
                    key={`${m.month}-${index}`}
                    className="flex min-w-[3rem] flex-1 flex-col items-center gap-3"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="flex h-36 w-full items-end justify-center gap-1 sm:h-45">
                      <div
                        className={`w-full max-w-5 rounded-t transition-all sm:max-w-7 ${isHover ? 'bg-positive/80' : 'bg-positive/50'}`}
                        style={{ height: `${(m.inflow / maxVal) * 144}px` }}
                      />
                      <div
                        className={`w-full max-w-5 rounded-t transition-all sm:max-w-7 ${isHover ? 'bg-destructive/70' : 'bg-destructive/40'}`}
                        style={{ height: `${(m.outflow / maxVal) * 144}px` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground sm:text-[11px]">{m.month}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
