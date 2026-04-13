import { useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff } from 'lucide-react'

import { usePortfolioHistory, usePortfolioSummary } from '@/hooks/usePortfolio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Period } from '@/types/api'

const periods: Period[] = ['1m', '3m', '6m', '1y', 'all']

function buildSparklinePath(points: number[], w: number, h: number, pad = 0) {
  if (points.length < 2) return { line: '', area: '' }
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const stepX = w / (points.length - 1)
  const coords = points.map((v, i) => ({
    x: i * stepX,
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }))
  const line = coords.map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`)).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return { line, area }
}

function formatVND(value: number): string {
  return value.toLocaleString('vi-VN')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function HeroSection() {
  const { t } = useTranslation()
  const [hidden, setHidden] = useState(() => localStorage.getItem('hideBalance') === '1')
  const toggleHidden = () => {
    setHidden((v) => {
      const next = !v
      localStorage.setItem('hideBalance', next ? '1' : '0')
      return next
    })
  }
  const { data: summary, isLoading } = usePortfolioSummary()
  const [period, setPeriod] = useState<Period>(
    () => (localStorage.getItem('heroPeriod') as Period) || '6m',
  )
  const handlePeriodChange = (value: string) => {
    setPeriod(value as Period)
    localStorage.setItem('heroPeriod', value)
  }
  const { data: history } = usePortfolioHistory(period)

  const rawPoints = history?.points || []
  const sparkPoints = rawPoints.map((p) => p.value)
  const svgW = 1400
  const svgH = 120
  const pad = 8
  const { line, area } = buildSparklinePath(sparkPoints, svgW, svgH, pad)

  const minVal = sparkPoints.length ? Math.min(...sparkPoints) : 0
  const maxVal = sparkPoints.length ? Math.max(...sparkPoints) : 0
  const rangeVal = maxVal - minVal || 1

  const chartRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!chartRef.current || rawPoints.length < 2) return
    const rect = chartRef.current.getBoundingClientRect()
    setContainerWidth(rect.width)
    const x = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    const idx = Math.round(ratio * (rawPoints.length - 1))
    setHoverIndex(idx)
  }
  const handleLeave = () => setHoverIndex(null)

  const hoverPoint = hoverIndex != null ? rawPoints[hoverIndex] : null
  const hoverXPct = hoverIndex != null ? (hoverIndex / (rawPoints.length - 1)) * 100 : 0
  const hoverYPct =
    hoverPoint != null
      ? ((pad + (1 - (hoverPoint.value - minVal) / rangeVal) * (svgH - pad * 2)) / svgH) * 100
      : 0

  const TOOLTIP_HALF_WIDTH = 85
  const rawTooltipX = (hoverXPct / 100) * containerWidth
  const minLeft = TOOLTIP_HALF_WIDTH + 8
  const maxLeft = containerWidth - TOOLTIP_HALF_WIDTH - 8
  const tooltipLeftPx =
    maxLeft < minLeft
      ? containerWidth / 2
      : Math.max(minLeft, Math.min(maxLeft, rawTooltipX))

  const totalValue = summary?.totalValue ?? 0
  const profit = summary?.profit ?? 0
  const profitPct = summary?.profitPercentage ?? 0
  const positive = profit >= 0

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-2xl" />
  }

  return (
    <Card className="relative w-full overflow-hidden rounded-2xl border-border bg-card">
      <CardContent className="relative z-10 flex min-w-0 flex-col gap-5 px-4 pt-5 pb-2 sm:px-8 sm:pt-8 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">
              {t('dashboard.totalValue')}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={toggleHidden}
              aria-label={hidden ? 'Show balance' : 'Hide balance'}
              className="text-muted-foreground hover:text-foreground"
            >
              {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </Button>
          </div>
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-['JetBrains_Mono'] text-[clamp(1.9rem,9vw,2.625rem)] font-bold leading-[0.95] tracking-tight text-foreground">
              {hidden ? '••••••••' : formatVND(totalValue)}
            </span>
            <span className="pb-1 text-base font-medium text-muted-foreground sm:text-lg">₫</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Badge
              variant={positive ? 'secondary' : 'destructive'}
              className={`gap-1.5 rounded-lg px-3 py-1 text-sm font-bold ${positive ? 'bg-positive/10 text-positive' : ''}`}
            >
              {positive ? '▲' : '▼'} {positive ? '+' : ''}
              {profitPct.toFixed(2)}%
            </Badge>
            <span className="text-sm text-muted-foreground">
              {hidden ? '••••••' : `${positive ? '+' : ''}${formatVND(profit)} ₫`}
            </span>
          </div>
        </div>

        <Tabs value={period} onValueChange={handlePeriodChange}>
          <TabsList className="h-auto flex-wrap justify-start md:justify-end">
            {periods.map((p) => (
              <TabsTrigger
                key={p}
                value={p}
                className="text-[11px] font-bold uppercase tracking-wider"
              >
                {t(`reports.periods.${p}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>

      <div
        ref={chartRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative z-0 mt-2 h-24 cursor-crosshair sm:h-25"
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="block h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? 'var(--positive)' : 'var(--negative)'} stopOpacity="0.2" />
              <stop offset="100%" stopColor={positive ? 'var(--positive)' : 'var(--negative)'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {line ? <path d={area} fill="url(#sparkGrad)" /> : null}
          {line ? (
            <path
              d={line}
              fill="none"
              stroke={positive ? 'var(--positive)' : 'var(--negative)'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>

        {hoverPoint ? (
          <>
            <div
              className="pointer-events-none absolute top-0 bottom-0 w-px bg-border"
              style={{ left: `${hoverXPct}%` }}
            />
            <div
              className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow"
              style={{
                left: `${hoverXPct}%`,
                top: `${hoverYPct}%`,
                backgroundColor: positive ? 'var(--positive)' : 'var(--negative)',
              }}
            />
            <div
              className="pointer-events-none absolute z-20 max-w-42.5 -translate-x-1/2 rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md"
              style={{
                left: `${tooltipLeftPx}px`,
                top: 4,
              }}
            >
              <div className="font-medium text-muted-foreground">{formatDate(hoverPoint.date)}</div>
              <div className="font-['JetBrains_Mono'] font-semibold text-foreground">
                {hidden ? '••••••' : `${formatVND(hoverPoint.value)} ₫`}
              </div>
              {(() => {
                const hoverProfit = hoverPoint.profit ?? 0
                const hoverPct = hoverPoint.profitPercentage ?? 0
                const hoverPositive = hoverProfit >= 0
                return (
                  <div
                    className={`flex items-center gap-1 font-['JetBrains_Mono'] text-[11px] font-medium ${hoverPositive ? 'text-positive' : 'text-negative'}`}
                  >
                    <span>{hoverPositive ? '▲' : '▼'}</span>
                    <span>
                      {hoverPositive ? '+' : ''}
                      {hoverPct.toFixed(2)}%
                    </span>
                    <span className="text-muted-foreground">
                      {hidden
                        ? '••••'
                        : `(${hoverPositive ? '+' : ''}${formatVND(hoverProfit)} ₫)`}
                    </span>
                  </div>
                )
              })()}
            </div>
          </>
        ) : null}
      </div>
    </Card>
  )
}
