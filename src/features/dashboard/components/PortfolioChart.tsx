import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePortfolioHistory } from '@/hooks/usePortfolio'
import type { Period } from '@/types/api'

const periods: Period[] = ['1m', '3m', '6m', '1y', 'all']

function buildPath(points: number[], w: number, h: number, pad = 4) {
  if (points.length < 2) return { line: '', area: '' }
  const min = Math.min(...points) * 0.98
  const max = Math.max(...points) * 1.02
  const range = max - min || 1
  const stepX = w / (points.length - 1)
  const coords = points.map((v, i) => ({ x: i * stepX, y: pad + (1 - (v - min) / range) * (h - pad * 2) }))
  const line = coords.map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`)).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return { line, area }
}

export default function PortfolioChart() {
  const { t } = useTranslation()
  const [activePeriod, setActivePeriod] = useState<Period>('6m')
  const { data: history } = usePortfolioHistory(activePeriod)

  const points = history?.points?.map((p) => p.value) || []
  const svgW = 800
  const svgH = 160
  const { line, area } = buildPath(points, svgW, svgH)

  const startVal = points[0] || 0
  const endVal = points[points.length - 1] || 0
  const change = startVal > 0 ? ((endVal - startVal) / startVal) * 100 : 0
  const positive = change >= 0

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel">
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-heading">{t('reports.performance')}</h3>
          {points.length > 0 && (
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${positive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
              {positive ? '↑' : '↓'} {positive ? '+' : ''}{change.toFixed(1)}%
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button key={p} onClick={() => setActivePeriod(p)} className={`cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${activePeriod === p ? 'bg-field text-heading' : 'bg-transparent text-caption hover:text-body'}`}>
              {t(`reports.periods.${p}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="px-2 pb-2">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="block h-[140px] w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? 'var(--positive)' : 'var(--negative)'} stopOpacity="0.15" />
              <stop offset="100%" stopColor={positive ? 'var(--positive)' : 'var(--negative)'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {line && <path d={area} fill="url(#perfGrad)" />}
          {line && <path d={line} fill="none" stroke={positive ? 'var(--positive)' : 'var(--negative)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
    </div>
  )
}
