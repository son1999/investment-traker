import { useTranslation } from 'react-i18next'
import { usePortfolioSummary, usePortfolioHistory } from '@/hooks/usePortfolio'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
    <Card className="relative overflow-hidden rounded-2xl border-edge bg-panel">
      <CardContent className="relative z-10 flex items-start justify-between px-8 pt-8 pb-2">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[1px] text-caption">
            {t('dashboard.totalValue')}
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-['JetBrains_Mono'] text-[42px] font-bold leading-none tracking-tight text-heading">
              {formatVND(totalValue)}
            </span>
            <span className="text-lg font-medium text-caption">₫</span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <Badge variant={positive ? 'secondary' : 'destructive'} className={`gap-1.5 rounded-lg px-3 py-1 text-sm font-bold ${positive ? 'bg-positive/10 text-positive' : ''}`}>
              {positive ? '▲' : '▼'} {positive ? '+' : ''}{profitPct.toFixed(2)}%
            </Badge>
            <span className="text-sm text-caption">{positive ? '+' : ''}{formatVND(profit)} ₫</span>
          </div>
        </div>

      </CardContent>

      <div className="relative z-0 mt-2">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="block h-[100px] w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? 'var(--positive)' : 'var(--negative)'} stopOpacity="0.2" />
              <stop offset="100%" stopColor={positive ? 'var(--positive)' : 'var(--negative)'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {line && <path d={area} fill="url(#sparkGrad)" />}
          {line && <path d={line} fill="none" stroke={positive ? 'var(--positive)' : 'var(--negative)'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
    </Card>
  )
}
