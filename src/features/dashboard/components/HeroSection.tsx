import { useTranslation } from 'react-i18next'

// Mock sparkline data — natural curve over 30 days
const sparkPoints = [
  820, 835, 810, 850, 870, 855, 880, 920, 905, 940,
  960, 945, 970, 990, 985, 1010, 1030, 1015, 1050, 1080,
  1060, 1090, 1110, 1095, 1130, 1150, 1170, 1200, 1220, 1250,
]

function buildSparklinePath(points: number[], w: number, h: number, pad = 0) {
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

export default function HeroSection() {
  const { t } = useTranslation()

  const svgW = 1400
  const svgH = 120
  const { line, area } = buildSparklinePath(sparkPoints, svgW, svgH, 8)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-edge bg-panel">
      {/* Content */}
      <div className="relative z-10 flex items-start justify-between px-8 pt-8 pb-2">
        {/* Left: Value */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[1px] text-caption">
            {t('dashboard.totalValue')}
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-['JetBrains_Mono'] text-[42px] font-bold leading-none tracking-tight text-heading">
              1,250,000,000
            </span>
            <span className="text-lg font-medium text-caption">₫</span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-positive/10 px-3 py-1 text-sm font-bold text-positive">
              <svg width="10" height="6" viewBox="0 0 12 7" fill="none">
                <path d="M1 6L6 1L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              +15.74%
            </span>
            <span className="text-sm text-caption">+170,000,000 ₫</span>
          </div>
        </div>

        {/* Right: Price alert inline */}
        <div className="flex items-center gap-3 rounded-xl bg-gold/10 px-4 py-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M12 2L1 21h22L12 2z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" className="text-gold" />
            <path d="M12 9v5M12 16v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gold" />
          </svg>
          <span className="text-xs font-medium text-gold">
            {t('dashboard.priceAlertDesc')}
          </span>
          <button className="cursor-pointer whitespace-nowrap rounded-md bg-gold/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold transition-colors hover:bg-gold/30">
            {t('dashboard.updateNow')}
          </button>
        </div>
      </div>

      {/* Sparkline */}
      <div className="relative z-0 mt-2">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="block h-[100px] w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--positive)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--positive)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#sparkGrad)" />
          <path d={line} fill="none" stroke="var(--positive)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
