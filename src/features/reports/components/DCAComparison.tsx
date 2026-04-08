import { useTranslation } from 'react-i18next'
import { Info, History } from 'lucide-react'
import { useDCAComparison } from '@/hooks/useReports'

function formatVND(v: number): string { return v.toLocaleString('vi-VN') + ' ₫' }

export default function DCAComparison({ code }: { code: string }) {
  const { t } = useTranslation()
  const { data } = useDCAComparison(code)
  if (!data) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-5 rounded-lg border border-edge bg-panel p-5">
        <div className="flex items-center justify-between">
          <span className="rounded bg-field px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-label">{t('reports.dcaActual')}</span>
          <Info size={13} className="text-dim" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5"><span className="text-xs text-caption">{t('reports.avgCost')}</span><span className="font-mono text-lg font-semibold text-heading">{formatVND(data.dca.avgCost)}</span></div>
          <div className="grid grid-cols-2 gap-4 border-y border-edge py-4">
            <div className="flex flex-col gap-0.5"><span className="text-[10px] uppercase text-caption">{t('reports.totalCapital')}</span><span className="font-mono text-sm text-body">{formatVND(data.dca.totalCapital)}</span></div>
            <div className="flex flex-col gap-0.5"><span className="text-[10px] uppercase text-caption">{t('reports.currentValue')}</span><span className="font-mono text-sm text-body">{formatVND(data.dca.currentValue)}</span></div>
          </div>
          <div className="flex flex-col gap-0.5"><span className="text-xs text-caption">{t('reports.estimatedProfit')}</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-base font-semibold ${data.dca.profit >= 0 ? 'text-positive' : 'text-negative'}`}>{data.dca.profit >= 0 ? '+' : ''}{formatVND(data.dca.profit)}</span>
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${data.dca.profitPercent >= 0 ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>{data.dca.profitPercent >= 0 ? '+' : ''}{data.dca.profitPercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 rounded-lg border border-edge-subtle bg-panel p-5">
        <div className="flex items-center justify-between">
          <span className="rounded bg-field px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-caption">{t('reports.lumpSum')}</span>
          <History size={13} className="text-dim" />
        </div>
        <p className="text-xs italic text-caption">{t('reports.lumpSumNote')}</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between"><span className="text-xs text-caption">{t('reports.priceAtThatTime')}</span><span className="font-mono text-sm text-body">{formatVND(data.lumpSum.priceAtFirstBuy)}</span></div>
          <div className="flex items-center justify-between border-y border-edge py-4"><span className="text-xs text-caption">{t('reports.currentValue')}</span><span className="font-mono text-sm text-body">{formatVND(data.lumpSum.currentValue)}</span></div>
          <div className="flex flex-col gap-0.5"><span className="text-xs text-caption">{t('reports.estimatedProfit')}</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-base font-semibold ${data.lumpSum.profit >= 0 ? 'text-positive/70' : 'text-negative/70'}`}>{data.lumpSum.profit >= 0 ? '+' : ''}{formatVND(data.lumpSum.profit)}</span>
              <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${data.lumpSum.profitPercent >= 0 ? 'bg-positive/5 text-positive/70' : 'bg-negative/5 text-negative/70'}`}>{data.lumpSum.profitPercent >= 0 ? '+' : ''}{data.lumpSum.profitPercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
