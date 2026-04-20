import { useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import heroArtwork from '@/assets/hero.png'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePortfolioHistory, usePortfolioSummary } from '@/hooks/usePortfolio'
import { formatCurrencySigned } from '@/lib/format'
import type { Period } from '@/types/api'

const periods: Period[] = ['1m', '3m', '6m', '1y', 'all']

function buildSparkline(points: number[], width: number, height: number, pad = 12) {
  if (points.length < 2) return { line: '', area: '' }

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const stepX = width / (points.length - 1)
  const coords = points.map((value, index) => ({
    x: index * stepX,
    y: pad + (1 - (value - min) / range) * (height - pad * 2),
  }))

  const line = coords.map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`)).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  return { line, area }
}

function formatDate(iso: string): string {
  const value = new Date(iso)
  if (Number.isNaN(value.getTime())) return iso
  return value.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function HeroSection() {
  const { t } = useTranslation()
  const [hidden, setHidden] = useState(() => localStorage.getItem('hideBalance') === '1')
  const [period, setPeriod] = useState<Period>(() => (localStorage.getItem('heroPeriod') as Period) || '6m')
  const { data: summary } = usePortfolioSummary()
  const { data: history } = usePortfolioHistory(period)

  const chartRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const points = history?.points || []
  const values = points.map((point) => point.value)
  const { line, area } = useMemo(() => buildSparkline(values, 1200, 240), [values])
  const hoverPoint = hoverIndex !== null ? points[hoverIndex] : null
  const hoverLeft = hoverIndex !== null && points.length > 1 ? (hoverIndex / (points.length - 1)) * 100 : 0

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!chartRef.current || points.length < 2) return
    const rect = chartRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHoverIndex(Math.round(ratio * (points.length - 1)))
  }

  const toggleHidden = () => {
    setHidden((value) => {
      const next = !value
      localStorage.setItem('hideBalance', next ? '1' : '0')
      return next
    })
  }

  const handlePeriodChange = (value: string) => {
    setPeriod(value as Period)
    localStorage.setItem('heroPeriod', value)
  }

  return (
    <section className="air-surface-lg air-photo-art relative overflow-hidden">
      <img
        src={heroArtwork}
        alt=""
        className="pointer-events-none absolute -right-12 bottom-0 hidden w-[34rem] max-w-[44%] opacity-90 lg:block"
      />
      <div className="relative z-10 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="air-kicker-pill">{t('dashboard.title')}</span>
              <Badge variant="outline">{t('dashboard.subtitle')}</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="air-section-eyebrow">{t('dashboard.totalValue')}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={toggleHidden}
                  aria-label={hidden ? 'Show balance' : 'Hide balance'}
                >
                  {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
              </div>

              <div className="space-y-3">
                <h1 className="air-metric-value">
                  {hidden ? '••••••••' : (summary?.totalValue ?? 0).toLocaleString('vi-VN')} ₫
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={summary && summary.profit < 0 ? 'destructive' : 'default'}>
                    {summary && summary.profit < 0 ? '' : '+'}
                    {summary?.profitPercentage?.toFixed(2) ?? '0.00'}%
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {hidden ? '••••••' : formatCurrencySigned(summary?.profit ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-xl flex-col gap-5 xl:items-end">
            <Tabs value={period} onValueChange={handlePeriodChange}>
              <TabsList className="w-full flex-wrap justify-start xl:w-auto xl:justify-end">
                {periods.map((item) => (
                  <TabsTrigger key={item} value={item}>
                    {t(`reports.periods.${item}`)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid w-full gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white/88 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm">
                <p className="air-section-eyebrow">{t('dashboard.capitalInvested')}</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  {(summary?.capitalInvested ?? 0).toLocaleString('vi-VN')} ₫
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {summary?.buyOrdersCount ?? 0} {t('dashboard.buyOrders')}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/88 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm">
                <p className="air-section-eyebrow">{t('dashboard.assets')}</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  {summary?.assetsCount ?? 0}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {summary?.assetCodes?.join(', ') || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={chartRef}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="relative mt-8 overflow-hidden rounded-[28px] bg-white/90 px-4 py-5 shadow-[var(--shadow-card)] backdrop-blur-sm sm:px-6"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="air-section-eyebrow">{t('reports.performance')}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t('reports.subtitle')}</p>
            </div>
            {hoverPoint ? (
              <div className="max-w-full self-start rounded-full bg-[var(--palette-surface-subtle)] px-4 py-2 sm:self-auto sm:text-right">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {formatDate(hoverPoint.date)}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {hidden ? '••••••' : `${hoverPoint.value.toLocaleString('vi-VN')} ₫`}
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative h-40 sm:h-48">
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
            <svg viewBox="0 0 1200 240" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,56,92,0.22)" />
                  <stop offset="100%" stopColor="rgba(255,56,92,0)" />
                </linearGradient>
              </defs>
              {line ? <path d={area} fill="url(#heroArea)" /> : null}
              {line ? (
                <path
                  d={line}
                  fill="none"
                  stroke="var(--palette-bg-primary-core)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
