import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useDCAChart } from '@/hooks/useReports'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function formatAmount(v: number, currency: string): string {
  if (currency === 'VND') {
    if (v >= 1e9) return `${(v / 1e9).toFixed(2)} tỷ`
    if (v >= 1e6) return `${(v / 1e6).toFixed(2)} tr`
    if (v >= 1e3) return `${(v / 1e3).toFixed(0)}k`
    return v.toFixed(0)
  }
  return v.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function DCAHeroChart({ code }: { code: string }) {
  const { t } = useTranslation()
  const { data } = useDCAChart(code)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  if (!data) return null

  const currency = data.currency || 'VND'
  const barHeights = data.purchaseAmounts
  const maxBar = Math.max(...barHeights, 1)
  const finalAvgCost =
    data.avgCostPrices.length > 0 ? data.avgCostPrices[data.avgCostPrices.length - 1] : 0
  const maxAvg = data.avgCostPrices.length > 0 ? Math.max(...data.avgCostPrices, data.currentPrice, 1) : 1
  const currentPricePct = Math.min(95, (data.currentPrice / maxAvg) * 65)
  const avgCostPct = Math.min(95, (finalAvgCost / maxAvg) * 65)
  const isProfit = data.currentPrice >= finalAvgCost

  const formatAvg = (v: number, cur: string): string => {
    if (cur === 'VND') {
      if (v >= 1e9) return `${(v / 1e9).toFixed(2)} tỷ VND`
      if (v >= 1e6) return `${(v / 1e6).toFixed(1)} tr VND`
      if (v >= 1e3) return `${(v / 1e3).toFixed(0)}k VND`
      return `${v.toFixed(0)} VND`
    }
    return `${v.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${cur}`
  }

  const plPct = finalAvgCost > 0 ? ((data.currentPrice - finalAvgCost) / finalAvgCost) * 100 : 0
  const plTone = isProfit ? 'text-positive' : 'text-negative'

  const stats = [
    { label: t('reports.numPurchases'), value: String(data.numPurchases) },
    { label: t('reports.avgInterval'), value: `${data.avgIntervalDays} ngay` },
    {
      label: t('reports.avgPerPurchase'),
      value: formatAvg(data.avgPerPurchase, currency),
    },
    {
      label: t('reports.avgCostPrice'),
      value: formatAvg(finalAvgCost, currency),
      tone: 'text-gold',
    },
    {
      label: t('reports.currentPrice'),
      value: formatAvg(data.currentPrice, currency),
      tone: plTone,
    },
    {
      label: t('reports.profitLoss'),
      value: `${plPct >= 0 ? '+' : ''}${plPct.toFixed(2)}%`,
      tone: plTone,
    },
  ]

  const hovered = hoverIndex != null ? hoverIndex : null
  const rawTooltipPct =
    hovered != null && barHeights.length > 0
      ? ((hovered + 0.5) / barHeights.length) * 100
      : 50
  const tooltipLeftPct = Math.min(95, Math.max(5, rawTooltipPct))
  const tooltipTranslate =
    rawTooltipPct < 15 ? '0%' : rawTooltipPct > 85 ? '-100%' : '-50%'

  return (
    <Card className="w-full min-w-0 border-border">
      <CardHeader className="flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-sm">{t('reports.dca')}</CardTitle>
          <CardDescription>{t('reports.dcaSub')}</CardDescription>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-5 md:justify-end">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-24 flex-col gap-0.5 md:items-end">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </span>
              <span className={`font-mono text-base font-semibold ${stat.tone ?? 'text-foreground'}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="min-w-0 space-y-5">
        <div className="relative pt-14">
          {hovered != null ? (
            <div
              className="pointer-events-none absolute top-0 z-30 max-w-[calc(100%-1rem)] whitespace-nowrap rounded-md border bg-popover px-2.5 py-1.5 text-[11px] leading-tight shadow-md"
              style={{ left: `${tooltipLeftPct}%`, transform: `translateX(${tooltipTranslate})` }}
            >
              <div className="mb-1 font-medium text-muted-foreground">
                #{hovered + 1} · {formatDate(data.purchaseDates?.[hovered] ?? '')}
              </div>
              <div className="flex flex-col gap-0.5 font-['JetBrains_Mono']">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{t('reports.purchaseAmount')}</span>
                  <span className="font-semibold text-foreground">
                    {formatAmount(data.purchaseAmounts?.[hovered] ?? 0, currency)} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">{t('assetDetail.colUnitPrice')}</span>
                  <span className="font-semibold text-foreground">
                    {formatAmount(data.purchaseUnitPrices?.[hovered] ?? 0, currency)} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block size-2 rounded-sm bg-gold" />
                    <span className="text-muted-foreground">{t('reports.avgCostPrice')}</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatAmount(data.avgCostPrices?.[hovered] ?? 0, currency)} {currency}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="relative flex h-44 min-w-0 items-end sm:h-50">
            <div className="relative flex min-w-0 flex-1 items-end justify-between gap-1.5 px-2 sm:gap-2 sm:px-8 lg:px-12">
              {barHeights.map((height, index) => {
                const isHover = hoverIndex === index
                return (
                  <div
                    key={index}
                    className={`relative flex-1 cursor-pointer rounded-t transition-colors ${isHover ? 'bg-muted-foreground/40' : 'bg-muted-foreground/20'}`}
                    style={{ height: `${(height / maxBar) * 170}px` }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                )
              })}

            </div>

            {finalAvgCost > 0 ? (
              <div
                className="pointer-events-none absolute right-2 left-2 border-t border-gold/70 sm:right-8 sm:left-8 lg:right-12 lg:left-12"
                style={{ bottom: `${avgCostPct}%` }}
              >
                <span className="absolute -top-2 left-0 rounded-sm border border-gold/40 bg-card px-1.5 font-mono text-[10px] font-semibold text-gold">
                  {formatAmount(finalAvgCost, currency)} {currency}
                </span>
              </div>
            ) : null}

            <div
              className={`pointer-events-none absolute right-2 left-2 border-t border-dashed sm:right-8 sm:left-8 lg:right-12 lg:left-12 ${isProfit ? 'border-positive/70' : 'border-negative/70'}`}
              style={{ bottom: `${currentPricePct}%` }}
            >
              <span
                className={`absolute -top-2 right-0 rounded-sm border bg-card px-1.5 font-mono text-[10px] font-semibold ${isProfit ? 'border-positive/40 text-positive' : 'border-negative/40 text-negative'}`}
              >
                {formatAmount(data.currentPrice, currency)} {currency}
              </span>
            </div>
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
            <div
              className={`h-px w-3 border-t border-dashed ${isProfit ? 'border-positive' : 'border-negative'}`}
            />
            <span className="text-[11px] text-muted-foreground">{t('reports.currentPrice')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
