import { useMemo, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePortfolioHistory } from '@/hooks/usePortfolio'
import { formatCurrency } from '@/lib/format'
import type { Period } from '@/types/api'

const periods: Period[] = ['1m', '3m', '6m', '1y', 'all']

function buildPath(points: number[], width: number, height: number, pad = 14) {
  if (points.length < 2) return { line: '', area: '' }

  const rawMin = Math.min(...points)
  const rawMax = Math.max(...points)
  const range = rawMax - rawMin || 1
  const min = rawMin - range * 0.08
  const max = rawMax + range * 0.08
  const stepX = width / (points.length - 1)
  const coords = points.map((value, index) => ({
    x: index * stepX,
    y: pad + (1 - (value - min) / (max - min || 1)) * (height - pad * 2),
  }))

  const line = coords.map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`)).join(' ')
  return { line, area: `${line} L${width},${height} L0,${height} Z` }
}

function formatDate(iso: string): string {
  const value = new Date(iso)
  if (Number.isNaN(value.getTime())) return iso
  return value.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function PortfolioChart() {
  const { t } = useTranslation()
  const [activePeriod, setActivePeriod] = useState<Period>('6m')
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const { data: history } = usePortfolioHistory(activePeriod)

  const points = history?.points || []
  const values = points.map((point) => point.profitPercentage ?? 0)
  const { line, area } = useMemo(() => buildPath(values, 1200, 320), [values])
  const currentChange = values.at(-1) ?? 0
  const hoverPoint = hoverIndex !== null ? points[hoverIndex] : null
  const hoverLeft = hoverIndex !== null && points.length > 1 ? (hoverIndex / (points.length - 1)) * 100 : 0

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (points.length < 2) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHoverIndex(Math.round(ratio * (points.length - 1)))
  }

  return (
    <section className="air-surface overflow-hidden">
      <div className="flex flex-col gap-5 border-b border-black/5 px-6 py-6 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="air-section-eyebrow">{t('reports.performance')}</span>
            <Badge variant={currentChange < 0 ? 'destructive' : 'default'}>
              {currentChange > 0 ? '+' : ''}
              {currentChange.toFixed(2)}%
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="text-[1.7rem] leading-[1.1] font-semibold tracking-[-0.04em] text-foreground">
              Portfolio momentum over time.
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t('reports.subtitle')}</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="hidden size-11 items-center justify-center rounded-full bg-[var(--palette-surface-muted)] sm:flex">
            <TrendingUp size={18} className="text-[var(--palette-bg-primary-core)]" />
          </div>
          <Tabs value={activePeriod} onValueChange={(value) => setActivePeriod(value as Period)}>
            <TabsList className="flex-wrap justify-start lg:justify-end">
              {periods.map((period) => (
                <TabsTrigger key={period} value={period}>
                  {t(`reports.periods.${period}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div
        className="relative px-4 py-6 sm:px-6"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {hoverPoint ? (
          <div
            className="air-tooltip-pop pointer-events-none absolute top-6 z-10 max-w-[calc(100%-2rem)] rounded-[20px] bg-white px-4 py-3 shadow-[var(--shadow-card)]"
            style={{ left: `clamp(1rem, ${hoverLeft}%, calc(100% - 12rem))` }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {formatDate(hoverPoint.date)}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {formatCurrency(hoverPoint.value)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hoverPoint.profitPercentage > 0 ? '+' : ''}
              {hoverPoint.profitPercentage.toFixed(2)}%
            </p>
          </div>
        ) : null}

        <div className="relative h-56 sm:h-72">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="absolute inset-x-0 border-t border-black/5"
              style={{ top: `${item * 33.333}%` }}
            />
          ))}
          {hoverPoint ? (
            <div
              className="absolute top-0 bottom-0 w-px bg-[rgba(255,56,92,0.24)]"
              style={{ left: `${hoverLeft}%` }}
            />
          ) : null}
          <svg viewBox="0 0 1200 320" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="portfolioArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,56,92,0.18)" />
                <stop offset="100%" stopColor="rgba(255,56,92,0)" />
              </linearGradient>
            </defs>
            {line ? <path d={area} fill="url(#portfolioArea)" /> : null}
            {line ? (
              <path
                d={line}
                fill="none"
                stroke={currentChange < 0 ? 'var(--destructive)' : 'var(--foreground)'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </svg>
        </div>
      </div>
    </section>
  )
}
