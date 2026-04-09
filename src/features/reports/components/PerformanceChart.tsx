import { useTranslation } from 'react-i18next'
import { usePerformance } from '@/hooks/useReports'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Period } from '@/types/api'

function buildAreaPath(values: number[], maxVal: number, w: number, h: number): { line: string; area: string } {
  if (values.length < 2) return { line: '', area: '' }
  const step = w / (values.length - 1)
  const coords = values.map((v, i) => ({ x: i * step, y: h - (v / maxVal) * h * 0.9 - h * 0.05 }))
  const line = coords.map((c, i) => (i === 0 ? `M${c.x} ${c.y}` : `L${c.x} ${c.y}`)).join(' ')
  return { line, area: `${line} L${w} ${h} L0 ${h} Z` }
}

export default function PerformanceChart({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = usePerformance(period)

  if (isLoading) return <Skeleton className="h-80 w-full rounded-lg" />

  const months = data?.months || []
  const series = data?.series || { metal: [], crypto: [], stock: [], savings: [] }
  const allValues = [...series.metal, ...series.crypto, ...series.stock, ...series.savings]
  const maxVal = Math.max(...allValues, 1)
  const svgW = 1000, svgH = 280

  const metalPath = buildAreaPath(series.metal, maxVal, svgW, svgH)
  const cryptoPath = buildAreaPath(series.crypto, maxVal, svgW, svgH)
  const stockPath = buildAreaPath(series.stock, maxVal, svgW, svgH)
  const savingsPath = buildAreaPath(series.savings, maxVal, svgW, svgH)

  const legend = [{ label: t('common.metal'), color: '#f59e0b' }, { label: t('common.crypto'), color: '#f97316' }, { label: t('common.stock'), color: '#60a5fa' }, { label: t('common.savings'), color: '#22c55e' }]

  return (
    <Card className="border-edge">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">{t('reports.performance')}</CardTitle>
        <div className="flex gap-5">{legend.map(l => (
          <div key={l.label} className="flex items-center gap-1.5"><div className="size-2 rounded-full" style={{ backgroundColor: l.color }} /><span className="text-xs text-caption">{l.label}</span></div>
        ))}</div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex w-10 flex-col justify-between pb-7 text-right">
            {[maxVal, maxVal * 0.66, maxVal * 0.33, 0].map((v, i) => (<span key={i} className="font-mono text-[10px] text-muted-foreground">{v >= 1e6 ? (v / 1e6).toFixed(0) + 'M' : v.toFixed(0)}</span>))}
          </div>
          <div className="relative flex-1">
            {[0,1,2,3].map(i => (<div key={i} className="absolute left-0 right-0 border-t border-border" style={{ top: `${i * 33.33}%` }} />))}
            <svg className="relative z-10 h-70 w-full" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" /><stop offset="100%" stopColor="#f59e0b" stopOpacity="0" /></linearGradient>
                <linearGradient id="btcFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity="0.12" /><stop offset="100%" stopColor="#f97316" stopOpacity="0" /></linearGradient>
                <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.10" /><stop offset="100%" stopColor="#60a5fa" stopOpacity="0" /></linearGradient>
                <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.12" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></linearGradient>
              </defs>
              {cryptoPath.line && <><path d={cryptoPath.area} fill="url(#btcFill)" /><path d={cryptoPath.line} stroke="#f97316" strokeWidth="1.5" fill="none" /></>}
              {metalPath.line && <><path d={metalPath.area} fill="url(#goldFill)" /><path d={metalPath.line} stroke="#f59e0b" strokeWidth="1.5" fill="none" /></>}
              {stockPath.line && <><path d={stockPath.area} fill="url(#stockFill)" /><path d={stockPath.line} stroke="#60a5fa" strokeWidth="1.5" fill="none" /></>}
              {savingsPath.line && <><path d={savingsPath.area} fill="url(#savingsFill)" /><path d={savingsPath.line} stroke="#22c55e" strokeWidth="1.5" fill="none" /></>}
            </svg>
            <div className="flex justify-between pt-3">{months.map(m => (<span key={m} className="text-[11px] text-caption">{m}</span>))}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
