import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useHoldings } from '@/hooks/usePortfolio'

function formatCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e9) return (value / 1e9).toFixed(2) + 'B'
  if (abs >= 1e6) return (value / 1e6).toFixed(1) + 'M'
  if (abs >= 1e3) return (value / 1e3).toFixed(1) + 'k'
  return value.toLocaleString('vi-VN')
}

const typeLabel: Record<string, string> = {
  metal: 'commodity',
  crypto: 'crypto',
  stock: 'stock',
}

export default function HoldingsTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: holdings } = useHoldings()

  const items = holdings || []
  const totalValue = items.reduce((s, h) => s + h.value, 0)
  const totalCost = items.reduce((s, h) => s + h.averageCost * h.quantity, 0)
  const totalPnlPct = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
  const totalPositive = totalPnlPct >= 0

  const columns = [t('dashboard.colAsset'), t('dashboard.colType'), t('dashboard.colQty'), t('dashboard.colAvgCost'), t('dashboard.colCurrentPrice'), 'Giá trị', t('dashboard.colPnl')]

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-edge bg-panel">
      <div className="flex items-center justify-between border-b border-edge-subtle px-8 py-6">
        <h3 className="text-base font-bold text-body">{t('dashboard.holdings')}</h3>
        <button className="cursor-pointer bg-transparent text-[13px] font-medium text-label hover:underline">{t('dashboard.viewDetails')}</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-panel-alt">
            {columns.map((col, i) => (
              <th key={col} className={`px-4 py-5 text-[11px] font-bold uppercase tracking-[0.6px] text-body ${i === 0 ? 'pl-8 text-left' : i === columns.length - 1 ? 'pr-8 text-right' : 'text-right'}`}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((h, idx) => (
            <tr key={h.assetCode} onClick={() => navigate(`/assets/${h.assetCode}`)} className={`cursor-pointer ${idx > 0 ? 'border-t border-[rgba(71,71,78,0.05)]' : ''} transition-colors hover:bg-[rgba(255,255,255,0.02)]`}>
              <td className="py-[18px] pl-8 pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-sm text-sm" style={{ backgroundColor: h.iconBg }}>{h.icon}</div>
                  <span className="text-sm font-semibold text-body">{h.name}</span>
                </div>
              </td>
              <td className="px-4 text-right"><span className="rounded-sm border border-edge-strong px-[9px] py-[3px] text-[10px] font-medium uppercase text-caption">{t(`common.${typeLabel[h.assetType] || h.assetType}`)}</span></td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] text-body">{h.quantity.toLocaleString('en-US')}</td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] text-body">{formatCompact(h.averageCost)}</td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] text-body">{formatCompact(h.currentPrice)}</td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] font-bold text-body">{formatCompact(h.value)}</td>
              <td className="py-[18px] pl-4 pr-8 text-right">
                <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold transition-all ${h.positive ? 'bg-positive/15 text-positive shadow-sm shadow-positive/20' : 'bg-negative/15 text-negative shadow-sm shadow-negative/20'}`}>
                  {h.positive ? <svg width="10" height="10" viewBox="0 0 12 7" fill="none"><path d="M1 6L6 1L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg width="10" height="10" viewBox="0 0 12 7" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  {h.positive ? '+' : ''}{h.profitLossPercent.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
          {items.length > 0 && (
            <tr className="border-t-2 border-edge bg-field/30">
              <td className="py-[18px] pl-8 pr-4"><span className="font-bold text-heading">Tổng cộng</span></td>
              <td className="px-4"></td><td className="px-4"></td><td className="px-4"></td><td className="px-4"></td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] font-bold text-heading">{formatCompact(totalValue)}</td>
              <td className="py-[18px] pl-4 pr-8 text-right">
                <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold ${totalPositive ? 'bg-positive/15 text-positive shadow-sm shadow-positive/20' : 'bg-negative/15 text-negative shadow-sm shadow-negative/20'}`}>{totalPositive ? '+' : ''}{totalPnlPct.toFixed(1)}%</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
