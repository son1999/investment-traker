import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Plus, MoreVertical, ExternalLink } from 'lucide-react'
import { useAssetDetail, useAssetTransactions } from '@/hooks/useAssets'
import type { Period } from '@/types/api'

const typeLabels: Record<string, string> = { metal: 'common.metal', crypto: 'common.crypto', stock: 'common.stock' }

function formatVND(v: number): string { return v.toLocaleString('vi-VN') }

export default function AssetDetailScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { code } = useParams<{ code: string }>()
  const [period, setPeriod] = useState<Period>('1y')

  const { data: asset } = useAssetDetail(code || '')
  const { data: txRes } = useAssetTransactions(code || '', { period })

  if (!asset) return <div className="flex items-center justify-center py-20"><span className="text-sm text-caption">Loading...</span></div>

  const metrics = [
    { label: t('assetDetail.holdings'), value: String(asset.metrics.holdings), unit: asset.assetCode, sub: '', border: '#454747' },
    { label: t('assetDetail.avgCost'), value: formatVND(asset.metrics.avgCost), unit: '₫', sub: `${t('assetDetail.totalCostLabel')}: ${formatVND(asset.unrealizedPnl.totalCost)} ₫`, border: '#454747' },
    { label: t('assetDetail.currentPrice'), value: formatVND(asset.metrics.currentPrice), unit: '₫', sub: '', border: '#f8a010', hasRefresh: true },
    { label: t('assetDetail.profit'), value: (asset.metrics.profit >= 0 ? '+' : '') + formatVND(asset.metrics.profit), unit: '₫', sub: asset.unrealizedPnl.totalCost > 0 ? `${asset.metrics.profit >= 0 ? '+' : ''}${((asset.metrics.profit / asset.unrealizedPnl.totalCost) * 100).toFixed(2)}%` : '', border: '#22c55e', isProfit: true },
  ]

  const txRows = txRes?.data || []
  const valueHistory = asset.valueHistory || []

  const svgW = 1120, svgH = 264
  let svgLine = '', svgArea = ''
  if (valueHistory.length >= 2) {
    const pts = valueHistory.map((p) => p.value)
    const min = Math.min(...pts) * 0.95, max = Math.max(...pts) * 1.05, range = max - min || 1
    const step = svgW / (pts.length - 1)
    const coords = pts.map((v, i) => ({ x: i * step, y: 10 + (1 - (v - min) / range) * (svgH - 20) }))
    svgLine = coords.map((c, i) => (i === 0 ? `M${c.x} ${c.y}` : `L${c.x} ${c.y}`)).join(' ')
    svgArea = `${svgLine} L${svgW} ${svgH} L0 ${svgH} Z`
  }

  const chartLabels = valueHistory.length > 0
    ? valueHistory.filter((_, i) => i % Math.max(1, Math.floor(valueHistory.length / 4)) === 0 || i === valueHistory.length - 1)
        .map((p) => new Date(p.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }))
    : []

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-6">
      <div className="mb-10 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center gap-2 bg-transparent text-sm font-medium text-caption transition-colors hover:text-heading"><ArrowLeft size={13} />{t('assetDetail.back')}</button>
        <div className="flex items-center gap-3">
          <button className="cursor-pointer rounded border border-edge bg-transparent px-4 py-2 text-sm font-medium text-body transition-colors hover:border-edge-strong">{t('assetDetail.updatePrice')}</button>
          <button className="flex cursor-pointer items-center gap-2 rounded bg-btn px-4 py-2 text-sm font-bold text-on-btn transition-colors hover:bg-btn-hover"><Plus size={11} />{t('assetDetail.addTransaction')}</button>
          <button className="cursor-pointer bg-transparent text-caption hover:text-heading"><MoreVertical size={16} /></button>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-5">
          <div className="flex size-14 items-center justify-center rounded-lg bg-field shadow-[0px_8px_32px_0px_rgba(231,228,236,0.04)]" style={{ backgroundColor: asset.iconBg }}><span className="text-[30px] text-body">{asset.icon}</span></div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-[-1.5px] text-heading">{asset.assetCode}</h1>
              <span className="rounded-xl border border-edge-strong px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[1.1px] text-caption">{t(typeLabels[asset.assetType] || asset.assetType)}</span>
            </div>
            <p className="text-sm tracking-[0.35px] text-caption">{t('assetDetail.assetDescription')}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-2 rounded-lg bg-panel py-6 pl-[26px] pr-6" style={{ borderLeft: `2px solid ${m.border}` }}>
              <span className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">{m.label}</span>
              <div className="flex items-baseline gap-1 pt-1">
                <span className={`font-['JetBrains_Mono'] text-xl font-semibold ${m.isProfit ? 'text-positive' : 'text-heading'}`}>{m.value}</span>
                <span className={`font-['JetBrains_Mono'] text-sm ${m.isProfit ? 'text-[rgba(34,197,94,0.7)]' : 'text-caption'}`}>{m.unit}</span>
                {m.hasRefresh && <ExternalLink size={9} className="ml-1 text-caption" />}
              </div>
              {m.isProfit ? <span className="inline-flex w-fit rounded-sm bg-positive/10 px-2 py-0.5 text-[10px] font-bold text-positive">{m.sub}</span> : <span className="text-xs text-[rgba(172,170,177,0.7)]">{m.sub}</span>}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-panel p-8 shadow-[0px_8px_32px_0px_rgba(231,228,236,0.04)]">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex flex-col gap-1"><h2 className="text-xl font-bold text-heading">{t('assetDetail.valueChart')}</h2><p className="text-sm text-caption">{t('assetDetail.valueChartDesc')}</p></div>
            <div className="flex gap-2">
              {(['1m', '1y', 'all'] as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`cursor-pointer rounded-sm px-3 py-1 text-[11px] font-bold ${period === p ? 'bg-field text-body' : 'bg-transparent text-caption'}`}>
                  {p === '1m' ? t('assetDetail.periodMonth') : p === '1y' ? t('assetDetail.periodYear') : t('assetDetail.periodAll')}
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-80">
            {[0, 1, 2, 3].map((i) => <div key={i} className="absolute left-0 right-0 border-t border-body opacity-10" style={{ top: `${8 + i * (304 / 3)}px` }} />)}
            {svgLine && (
              <svg className="absolute left-0 top-6 h-[264px] w-full" viewBox={`0 0 ${svgW} ${svgH}`} fill="none" preserveAspectRatio="none">
                <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8a010" stopOpacity="0.15" /><stop offset="100%" stopColor="#f8a010" stopOpacity="0" /></linearGradient></defs>
                <path d={svgArea} fill="url(#chartGrad)" /><path d={svgLine} stroke="#f8a010" strokeWidth="2" fill="none" />
              </svg>
            )}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between">{chartLabels.map((l) => <span key={l} className="font-['JetBrains_Mono'] text-[10px] uppercase text-caption">{l}</span>)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6 rounded-lg bg-panel py-6 pl-[26px] pr-6" style={{ borderLeft: '2px solid rgba(34,197,94,0.3)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[1.4px] text-caption">{t('assetDetail.realizedPnl')}</h3>
              <span className="font-['JetBrains_Mono'] text-lg font-bold text-positive">{asset.realizedPnl.total >= 0 ? '+' : ''}{formatVND(asset.realizedPnl.total)} ₫</span>
            </div>
            <table className="w-full"><thead><tr className="border-b border-edge-subtle"><th className="pb-3 text-left text-xs font-medium text-caption">{t('assetDetail.colDate')}</th><th className="pb-3 text-left text-xs font-medium text-caption">{t('assetDetail.colQty')}</th><th className="pb-3 text-right text-xs font-medium text-caption">{t('reports.profitLoss')}</th></tr></thead>
              <tbody>{asset.realizedPnl.transactions.map((rpnl, i) => (
                <tr key={i}><td className="py-3 text-xs text-[rgba(231,228,236,0.9)]">{new Date(rpnl.date).toLocaleDateString('vi-VN')}</td><td className="py-3 font-['JetBrains_Mono'] text-xs text-[rgba(231,228,236,0.9)]">{rpnl.quantity} {asset.assetCode}</td><td className={`py-3 text-right font-['JetBrains_Mono'] text-xs ${rpnl.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>{rpnl.pnl >= 0 ? '+' : ''}{formatVND(rpnl.pnl)} ₫</td></tr>
              ))}</tbody></table>
          </div>
          <div className="flex flex-col gap-6 rounded-lg bg-panel py-6 pl-[26px] pr-6" style={{ borderLeft: '2px solid rgba(248,160,16,0.3)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[1.4px] text-caption">{t('assetDetail.unrealizedPnl')}</h3>
              <span className={`font-['JetBrains_Mono'] text-lg font-bold ${asset.unrealizedPnl.total >= 0 ? 'text-positive' : 'text-negative'}`}>{asset.unrealizedPnl.total >= 0 ? '+' : ''}{formatVND(asset.unrealizedPnl.total)} ₫</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-edge-subtle pb-2"><span className="text-xs text-caption">{t('assetDetail.currentValue')}</span><span className="font-['JetBrains_Mono'] text-xs text-body">{formatVND(asset.unrealizedPnl.currentValue)} ₫</span></div>
              <div className="flex items-center justify-between border-b border-edge-subtle pb-2"><span className="text-xs text-caption">{t('assetDetail.totalCost')}</span><span className="font-['JetBrains_Mono'] text-xs text-body">{formatVND(asset.unrealizedPnl.totalCost)} ₫</span></div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-panel-alt shadow-[0px_8px_32px_0px_rgba(231,228,236,0.04)]">
          <div className="px-8 py-6"><h2 className="text-lg font-bold text-heading">{t('assetDetail.transactionsOf', { code: asset.assetCode })}</h2><p className="text-xs text-caption">{t('assetDetail.transactionsCount', { count: txRes?.meta?.total || 0 })}</p></div>
          <table className="w-full">
            <thead><tr className="bg-[rgba(37,37,43,0.4)]">
              {[t('assetDetail.colDate'), t('assetDetail.colType'), t('assetDetail.colQty'), t('assetDetail.colUnitPrice'), t('assetDetail.colTotal'), t('assetDetail.colNote'), t('assetDetail.colAction')].map((col, i) => (
                <th key={col} className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-[1.1px] text-caption ${i === 0 ? 'pl-8' : ''} ${i === 6 ? 'pr-8 text-right' : 'text-left'}`}>{col}</th>
              ))}
            </tr></thead>
            <tbody>{txRows.map((row, idx) => (
              <tr key={row.id} className={`${idx > 0 ? 'border-t border-edge-subtle' : ''} transition-colors hover:bg-[rgba(255,255,255,0.02)]`}>
                <td className="py-[22px] pl-8 pr-6 font-['JetBrains_Mono'] text-sm text-body">{new Date(row.date).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-[22px]">{row.action === 'MUA' ? <span className="rounded-sm bg-positive/10 px-2 text-[10px] font-bold text-positive">{t('common.buy')}</span> : <span className="rounded-sm bg-[rgba(127,41,39,0.2)] px-2 text-[10px] font-bold text-[#bb5551]">{t('common.sell')}</span>}</td>
                <td className="px-6 py-[22px] font-['JetBrains_Mono'] text-sm text-body">{row.quantity}</td>
                <td className="px-6 py-[22px] font-['JetBrains_Mono'] text-sm text-body">{formatVND(row.unitPrice)}</td>
                <td className="px-6 py-[22px] font-['JetBrains_Mono'] text-sm text-body">{formatVND(row.total)}</td>
                <td className="px-6 py-[22px] text-sm italic text-caption">{row.note || '—'}</td>
                <td className="py-[22px] pl-6 pr-8 text-right"><button className="cursor-pointer bg-transparent text-caption transition-colors hover:text-heading"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12.75 2.25l3 3M2.25 12.75l-0.75 3.75 3.75-0.75L14.25 6.75l-3-3L2.25 12.75z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
