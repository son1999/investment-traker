import { useTranslation } from 'react-i18next'

export default function CashFlowChart() {
  const { t } = useTranslation()

  const months = [
    { label: t('reports.month1'), inflow: 96, outflow: 32 },
    { label: t('reports.month2'), inflow: 160, outflow: 48 },
    { label: t('reports.month3'), inflow: 128, outflow: 80 },
    { label: t('reports.month4'), inflow: 208, outflow: 64 },
    { label: t('reports.month5'), inflow: 112, outflow: 40 },
    { label: t('reports.month6'), inflow: 176, outflow: 56 },
  ]

  const maxVal = 220

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-edge bg-panel p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-heading">{t('reports.cashFlow')}</h2>
          <p className="mt-0.5 text-xs text-caption">{t('reports.cashFlowSub')}</p>
        </div>
        <div className="flex gap-5">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-positive/60" />
            <span className="text-[11px] text-caption">{t('reports.inflow')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-negative/60" />
            <span className="text-[11px] text-caption">{t('reports.outflow')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-6 px-2">
        {months.map((m) => (
          <div key={m.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex w-full items-end justify-center gap-1" style={{ height: '180px' }}>
              {/* Inflow bar */}
              <div
                className="w-full max-w-[28px] rounded-t bg-positive/50"
                style={{ height: `${(m.inflow / maxVal) * 160}px` }}
              />
              {/* Outflow bar */}
              <div
                className="w-full max-w-[28px] rounded-t bg-negative/40"
                style={{ height: `${(m.outflow / maxVal) * 160}px` }}
              />
            </div>
            <span className="font-mono text-[11px] text-caption">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
