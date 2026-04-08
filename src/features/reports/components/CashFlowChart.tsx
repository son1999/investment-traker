import { useTranslation } from 'react-i18next'
import { useCashFlow } from '@/hooks/useReports'
import type { Period } from '@/types/api'

export default function CashFlowChart({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data } = useCashFlow(period)

  const months = data || []
  const maxVal = Math.max(...months.map((m) => Math.max(m.inflow, m.outflow)), 1)

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-edge bg-panel p-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-sm font-medium text-heading">{t('reports.cashFlow')}</h2><p className="mt-0.5 text-xs text-caption">{t('reports.cashFlowSub')}</p></div>
        <div className="flex gap-5">
          <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-positive/60" /><span className="text-[11px] text-caption">{t('reports.inflow')}</span></div>
          <div className="flex items-center gap-1.5"><div className="size-2 rounded-sm bg-negative/60" /><span className="text-[11px] text-caption">{t('reports.outflow')}</span></div>
        </div>
      </div>
      <div className="flex items-end gap-6 px-2">
        {months.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex w-full items-end justify-center gap-1" style={{ height: '180px' }}>
              <div className="w-full max-w-[28px] rounded-t bg-positive/50" style={{ height: `${(m.inflow / maxVal) * 160}px` }} />
              <div className="w-full max-w-[28px] rounded-t bg-negative/40" style={{ height: `${(m.outflow / maxVal) * 160}px` }} />
            </div>
            <span className="font-mono text-[11px] text-caption">{m.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
