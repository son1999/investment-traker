import { useTranslation } from 'react-i18next'

import { usePortfolioHistory, usePortfolioSummary } from '@/hooks/usePortfolio'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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

export default function HeroSection() {
  const { t } = useTranslation()
  const { data: summary, isLoading } = usePortfolioSummary()
  const { data: history } = usePortfolioHistory('6m')

  const sparkPoints = history?.points?.map((p) => p.value) || []
  const svgW = 1400
  const svgH = 120
  const { line, area } = buildSparklinePath(sparkPoints, svgW, svgH, 8)

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
        <div className="min-w-0 flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[1px] text-muted-foreground">
            {t('dashboard.totalValue')}
          </span>
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-['JetBrains_Mono'] text-[clamp(1.9rem,9vw,2.625rem)] font-bold leading-[0.95] tracking-tight text-foreground">
              {formatVND(totalValue)}
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
              {positive ? '+' : ''}
              {formatVND(profit)} ₫
            </span>
          </div>
        </div>
      </CardContent>

      <div className="relative z-0 mt-2">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="block h-[96px] w-full sm:h-[100px]" preserveAspectRatio="none">
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
      </div>
    </Card>
  )
}
