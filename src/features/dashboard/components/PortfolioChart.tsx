import { useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePortfolioHistory } from '@/hooks/usePortfolio'
import type { Period } from '@/types/api'

const periods: Period[] = ['1m', '3m', '6m', '1y', 'all']

function buildPath(points: number[], w: number, h: number, pad: number) {
  if (points.length < 2) return { line: '', area: '', min: 0, max: 0 }
  const rawMin = Math.min(...points)
  const rawMax = Math.max(...points)
  const span = rawMax - rawMin || 1
  const min = rawMin - span * 0.1
  const max = rawMax + span * 0.1
  const range = max - min || 1
  const stepX = w / (points.length - 1)
  const coords = points.map((value, index) => ({
    x: index * stepX,
    y: pad + (1 - (value - min) / range) * (h - pad * 2),
  }))
  const line = coords
    .map((coord, index) => (index === 0 ? `M${coord.x},${coord.y}` : `L${coord.x},${coord.y}`))
    .join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return { line, area, min, max }
}

function formatVND(value: number): string {
  return value.toLocaleString('vi-VN')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function PortfolioChart() {
  const { t } = useTranslation()
  const [activePeriod, setActivePeriod] = useState<Period>('6m')
  const { data: history } = usePortfolioHistory(activePeriod)

  const rawPoints = history?.points || []
  const perfPoints = rawPoints.map((point) => point.profitPercentage ?? 0)
  const svgW = 800
  const svgH = 160
  const pad = 16
  const { line, area, min, max } = buildPath(perfPoints, svgW, svgH, pad)
  const range = max - min || 1

  const change = perfPoints.length > 0 ? perfPoints[perfPoints.length - 1] : 0
  const positive = change >= 0

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
      ? ((pad + (1 - ((hoverPoint.profitPercentage ?? 0) - min) / range) * (svgH - pad * 2)) /
          svgH) *
        100
      : 0

  const TOOLTIP_HALF_WIDTH = 70
  const rawTooltipX = (hoverXPct / 100) * containerWidth
  const minLeft = TOOLTIP_HALF_WIDTH + 8
  const maxLeft = containerWidth - TOOLTIP_HALF_WIDTH - 8
  const tooltipLeftPx =
    maxLeft < minLeft
      ? containerWidth / 2
      : Math.max(minLeft, Math.min(maxLeft, rawTooltipX))

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="flex flex-col gap-4 px-4 pt-4 pb-3 sm:px-6 sm:pt-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h3 className="text-sm font-bold">{t('reports.performance')}</h3>
          {perfPoints.length > 0 ? (
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${positive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
              {positive ? '↑' : '↓'} {positive ? '+' : ''}{change.toFixed(1)}%
            </span>
          ) : null}
        </div>
        <Tabs value={activePeriod} onValueChange={(value) => setActivePeriod(value as Period)}>
          <TabsList className="h-auto flex-wrap justify-start md:justify-end">
            {periods.map((period) => (
              <TabsTrigger
                key={period}
                value={period}
                className="text-[11px] font-bold uppercase tracking-wider"
              >
                {t(`reports.periods.${period}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div
        ref={chartRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative cursor-crosshair"
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="block h-30 w-full sm:h-35"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={positive ? 'var(--positive)' : 'var(--negative)'}
                stopOpacity="0.15"
              />
              <stop
                offset="100%"
                stopColor={positive ? 'var(--positive)' : 'var(--negative)'}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          {line ? <path d={area} fill="url(#perfGrad)" /> : null}
          {line ? (
            <path
              d={line}
              fill="none"
              stroke={positive ? 'var(--positive)' : 'var(--negative)'}
              strokeWidth="2.5"
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
              className="pointer-events-none absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-2 py-1.5 text-[11px] leading-tight shadow-md"
              style={{
                left: `${tooltipLeftPx}px`,
                top: 4,
              }}
            >
              <div className="mb-0.5 font-medium text-muted-foreground">
                {formatDate(hoverPoint.date)}
              </div>
              {(() => {
                const hoverCost = hoverPoint.cost ?? 0
                const hoverValue = hoverPoint.value ?? 0
                const hoverProfit = hoverPoint.profit ?? 0
                const hoverPct = hoverPoint.profitPercentage ?? 0
                const hoverPositive = hoverProfit >= 0
                return (
                  <div className="flex flex-col font-['JetBrains_Mono']">
                    <span className="font-semibold text-foreground">
                      {formatVND(hoverValue)} ₫
                    </span>
                    <span className="text-muted-foreground">
                      /{formatVND(hoverCost)} ₫
                    </span>
                    <span
                      className={`font-semibold ${hoverPositive ? 'text-positive' : 'text-negative'}`}
                    >
                      {hoverPositive ? '▲' : '▼'} {hoverPositive ? '+' : ''}
                      {hoverPct.toFixed(2)}%
                    </span>
                  </div>
                )
              })()}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
