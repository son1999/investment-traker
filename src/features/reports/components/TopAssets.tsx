import { useTranslation } from 'react-i18next'
import { useTopAssets } from '@/hooks/useReports'
import type { Period } from '@/types/api'

function formatCompact(v: number): string {
  if (Math.abs(v) >= 1e9) return (v / 1e9).toFixed(2) + 'B'
  if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + 'M'
  if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + 'k'
  return v.toLocaleString('vi-VN')
}

const assetColors: Record<string, string> = { BTC: '#f97316', SJC: '#f59e0b', ETH: '#8b5cf6', FPT: '#60a5fa', VNM: '#60a5fa' }

export default function TopAssets({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data } = useTopAssets(period, 5)
  const rows = data || []

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-edge bg-panel p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-heading">{t('reports.topAssets')}</h3>
        <button className="cursor-pointer bg-transparent text-xs text-caption hover:text-label">{t('reports.details')}</button>
      </div>
      <table className="w-full">
        <thead><tr className="border-b border-edge">
          {['#', t('reports.asset'), t('reports.invested'), t('reports.currentValue'), t('reports.profitLoss'), t('reports.weight')].map((h, i) => (
            <th key={h} className={`pb-3 text-[11px] font-medium text-caption ${i <= 1 ? 'text-left' : 'text-right'} ${i === 0 ? 'w-8' : ''}`}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{rows.map((r) => {
          const color = assetColors[r.assetCode] || '#888'
          return (
            <tr key={r.rank} className="border-t border-edge-subtle">
              <td className="py-3.5 font-mono text-xs text-caption">{String(r.rank).padStart(2, '0')}</td>
              <td className="py-3.5"><div className="flex items-center gap-2.5"><div className="flex size-7 items-center justify-center rounded bg-field"><span className="text-xs font-bold" style={{ color }}>{r.icon}</span></div><div className="flex flex-col"><span className="text-xs font-medium text-body">{r.name}</span><span className="text-[10px] text-caption">{r.assetCode}</span></div></div></td>
              <td className="py-3.5 text-right font-mono text-xs text-body">{formatCompact(r.invested)}</td>
              <td className="py-3.5 text-right font-mono text-xs" style={{ color: r.positive ? 'var(--body)' : 'var(--negative)' }}>{formatCompact(r.currentValue)}</td>
              <td className="py-3.5 text-right"><div className="flex flex-col items-end"><span className="font-mono text-xs font-medium" style={{ color: r.positive ? 'var(--positive)' : 'var(--negative)' }}>{r.positive ? '+' : ''}{r.profitLossPercent.toFixed(1)}%</span><span className="text-[10px] text-dim">{r.positive ? '+' : ''}{formatCompact(r.profitLossAmount)}</span></div></td>
              <td className="py-3.5"><div className="flex items-center gap-2 pl-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-field"><div className="h-full rounded-full" style={{ width: `${r.weight}%`, backgroundColor: color }} /></div><span className="font-mono text-[10px] text-caption">{r.weight}%</span></div></td>
            </tr>
          )
        })}</tbody>
      </table>
    </div>
  )
}
