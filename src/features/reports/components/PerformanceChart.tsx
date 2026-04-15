import { useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { usePerformance } from '@/hooks/useReports'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Period } from '@/types/api'
import { formatCurrency, formatAxisCompact } from '@/lib/format'

const SERIES_KEYS = ['savings', 'stock', 'metal', 'crypto'] as const
type SeriesKey = (typeof SERIES_KEYS)[number]

const COLORS: Record<SeriesKey, string> = {
  savings: '#10b981',
  stock: '#3b82f6',
  metal: '#eab308',
  crypto: '#ef4444',
}

function buildLayer(
  lower: number[],
  upper: number[],
  maxVal: number,
  w: number,
  h: number,
  pad: number,
): string {
  if (upper.length < 2) return ''
  const step = w / (upper.length - 1)
  const usable = h - pad * 2
  const yOf = (v: number) => pad + (1 - v / maxVal) * usable

  const top = upper.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * step} ${yOf(v)}`).join(' ')
  const bottom = lower
    .slice()
    .reverse()
    .map((v, i) => `L${(lower.length - 1 - i) * step} ${yOf(v)}`)
    .join(' ')
  return `${top} ${bottom} Z`
}

function buildLine(values: number[], maxVal: number, w: number, h: number, pad: number): string {
  if (values.length < 2) return ''
  const step = w / (values.length - 1)
  const usable = h - pad * 2
  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${i * step} ${pad + (1 - v / maxVal) * usable}`)
    .join(' ')
}

export default function PerformanceChart({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = usePerformance(period)

  const chartRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [hiddenSeries, setHiddenSeries] = useState<Set<SeriesKey>>(new Set())

  const toggleSeries = (key: SeriesKey) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (isLoading) return <Skeleton className="h-80 w-full rounded-lg" />

  const months = data?.months || []
  const series = data?.series || { metal: [], crypto: [], stock: [], savings: [] }
  const len = months.length

  const visibleKeys = SERIES_KEYS.filter((k) => !hiddenSeries.has(k))

  const stacks: Record<SeriesKey, number[]> = {
    savings: [],
    stock: [],
    metal: [],
    crypto: [],
  }
  for (let i = 0; i < len; i++) {
    let cum = 0
    for (const k of SERIES_KEYS) {
      if (!hiddenSeries.has(k)) cum += series[k][i] ?? 0
      stacks[k].push(cum)
    }
  }

  const topStackKey = visibleKeys.length > 0 ? visibleKeys[visibleKeys.length - 1] : 'crypto'
  const totals = stacks[topStackKey]
  const maxVal = Math.max(...totals, 1) * 1.05
  const svgW = 1000
  const svgH = 280
  const pad = 12

  const zeros = new Array(len).fill(0)
  const layers: { key: SeriesKey; d: string; lineD: string }[] = SERIES_KEYS.filter(
    (k) => !hiddenSeries.has(k),
  ).map((k) => {
    const idx = SERIES_KEYS.indexOf(k)
    const lower = idx === 0 ? zeros : stacks[SERIES_KEYS[idx - 1]]
    const upper = stacks[k]
    return {
      key: k,
      d: buildLayer(lower, upper, maxVal, svgW, svgH, pad),
      lineD: buildLine(upper, maxVal, svgW, svgH, pad),
    }
  })

  const seriesList = SERIES_KEYS.map((k) => ({
    key: k,
    label: t(`common.${k}`),
    color: COLORS[k],
    values: series[k],
  }))

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!chartRef.current || len < 2) return
    const rect = chartRef.current.getBoundingClientRect()
    setContainerWidth(rect.width)
    const x = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, x / rect.width))
    setHoverIndex(Math.round(ratio * (len - 1)))
  }
  const handleLeave = () => setHoverIndex(null)

  const hoverXPct = hoverIndex != null ? (hoverIndex / (len - 1)) * 100 : 0
  const TOOLTIP_HALF_WIDTH = 105
  const rawTooltipX = (hoverXPct / 100) * containerWidth
  const minLeft = TOOLTIP_HALF_WIDTH + 8
  const maxLeft = containerWidth - TOOLTIP_HALF_WIDTH - 8
  const tooltipLeftPx =
    maxLeft < minLeft
      ? containerWidth / 2
      : Math.max(minLeft, Math.min(maxLeft, rawTooltipX))

  const hoverTotal =
    hoverIndex != null
      ? seriesList.reduce(
          (sum, s) => sum + (hiddenSeries.has(s.key) ? 0 : s.values[hoverIndex] ?? 0),
          0,
        )
      : 0

  return (
    <Card className="w-full min-w-0 border-border">
      <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-sm">{t('reports.performance')}</CardTitle>
        <div className="flex flex-wrap gap-4 md:gap-5">
          {seriesList.map((s) => {
            const hidden = hiddenSeries.has(s.key)
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => toggleSeries(s.key)}
                className={`flex items-center gap-1.5 transition-opacity ${hidden ? 'opacity-40' : 'opacity-100'}`}
              >
                <div
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: hidden ? 'transparent' : s.color, border: `1.5px solid ${s.color}` }}
                />
                <span className={`text-xs text-muted-foreground ${hidden ? 'line-through' : ''}`}>
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="flex gap-3">
          <div className="flex w-12 flex-col justify-between pt-3 pb-7 text-right">
            {[1, 0.75, 0.5, 0.25, 0].map((r, i) => (
              <span key={i} className="font-mono text-[10px] text-muted-foreground">
                {formatAxisCompact(maxVal * r)}
              </span>
            ))}
          </div>
          <div
            ref={chartRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="relative flex-1 cursor-crosshair"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((r) => (
              <div
                key={r}
                className="pointer-events-none absolute right-0 left-0 border-t border-border/60"
                style={{ top: `${r * 100}%` }}
              />
            ))}
            <svg
              className="relative z-10 h-70 w-full"
              viewBox={`0 0 ${svgW} ${svgH}`}
              preserveAspectRatio="none"
            >
              <defs>
                {SERIES_KEYS.map((k) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS[k]} stopOpacity="1" />
                    <stop offset="100%" stopColor={COLORS[k]} stopOpacity="0.85" />
                  </linearGradient>
                ))}
              </defs>
              {layers.map((layer) => (
                <path key={layer.key} d={layer.d} fill={`url(#grad-${layer.key})`} />
              ))}
              {layers.map((layer) => (
                <path
                  key={`line-${layer.key}`}
                  d={layer.lineD}
                  fill="none"
                  stroke={COLORS[layer.key]}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {hoverIndex != null && len > 1 ? (
                <line
                  x1={(hoverIndex / (len - 1)) * svgW}
                  x2={(hoverIndex / (len - 1)) * svgW}
                  y1={0}
                  y2={svgH}
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
            </svg>

            {hoverIndex != null && len > 1 ? (
              <div
                className="pointer-events-none absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-3 py-2 text-[11px] leading-tight shadow-md"
                style={{ left: `${tooltipLeftPx}px`, top: 4 }}
              >
                <div className="mb-1.5 font-medium text-muted-foreground">
                  {months[hoverIndex]}
                </div>
                <div className="mb-1.5 flex items-center justify-between gap-4 border-b pb-1.5 font-['JetBrains_Mono']">
                  <span className="text-xs font-semibold text-foreground">
                    {t('dashboard.total')}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {formatCurrency(hoverTotal)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 font-['JetBrains_Mono']">
                  {seriesList
                    .slice()
                    .reverse()
                    .map((s) => {
                      if (hiddenSeries.has(s.key)) return null
                      const v = s.values[hoverIndex] ?? 0
                      if (v === 0) return null
                      return (
                        <div key={s.key} className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="inline-block size-2 rounded-sm"
                              style={{ backgroundColor: s.color }}
                            />
                            <span className="text-muted-foreground">{s.label}</span>
                          </span>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(v)}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
            ) : null}

            <div className="flex justify-between pt-3">
              {months.map((m, index) => (
                <span key={`${m}-${index}`} className="text-[11px] text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
