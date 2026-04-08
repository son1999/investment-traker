import { useTranslation } from 'react-i18next'
import { usePortfolioSummary, usePortfolioHistory } from '@/hooks/usePortfolio'

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
  const { data: summary } = usePortfolioSummary()
  const { data: history } = usePortfolioHistory('6m')

  const sparkPoints = history?.points?.map((p) => p.value) || []
  const svgW = 1400
  const svgH = 120
  const { line, area } = buildSparklinePath(sparkPoints, svgW, svgH, 8)

  const totalValue = summary?.totalValue ?? 0
  const profit = summary?.profit ?? 0
  const profitPct = summary?.profitPercentage ?? 0
  const positive = profit >= 0

  return (
    <div className="relative overflow-hidden rounded-2xl border border-edge bg-panel">
      <div className="relative z-10 flex items-start justify-between px-8 pt-8 pb-2">
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
            <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold ${positive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
              {positive ? (
                <svg width="10" height="6" viewBox="0 0 12 7" fill="none"><path d="M1 6L6 1L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg width="10" height="6" viewBox="0 0 12 7" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
              {positive ? '+' : ''}{profitPct.toFixed(2)}%
            </span>
            <span className="text-sm text-caption">{positive ? '+' : ''}{formatVND(profit)} ₫</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-gold/10 px-4 py-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M12 2L1 21h22L12 2z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
            <path d="M12 9v5M12 16v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gold" />
          </svg>
          <span className="text-xs font-medium text-gold">{t('dashboard.priceAlertDesc')}</span>
          <button className="cursor-pointer whitespace-nowrap rounded-md bg-gold/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold transition-colors hover:bg-gold/30">
            {t('dashboard.updateNow')}
          </button>
        </div>
      </div>

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
    </div>
  )
}
