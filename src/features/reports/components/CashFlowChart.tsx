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
              className="pointer-events-none absolute top-0 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-2.5 py-1.5 text-[11px] leading-tight shadow-md"
              style={{ left: `${tooltipLeftPct}%` }}
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
            <div className="flex min-w-130 items-end gap-4 px-2 sm:gap-6">
              {months.map((m, index) => {
                const isHover = hoverIndex === index
                return (
                  <div
                    key={`${m.month}-${index}`}
                    className="flex flex-1 flex-col items-center gap-3"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="flex h-45 w-full items-end justify-center gap-1">
                      <div
                        className={`w-full max-w-7 rounded-t transition-all ${isHover ? 'bg-positive/80' : 'bg-positive/50'}`}
                        style={{ height: `${(m.inflow / maxVal) * 160}px` }}
                      />
                      <div
                        className={`w-full max-w-7 rounded-t transition-all ${isHover ? 'bg-destructive/70' : 'bg-destructive/40'}`}
                        style={{ height: `${(m.outflow / maxVal) * 160}px` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">{m.month}</span>
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
