import { useTranslation } from 'react-i18next'

export default function MetricCards() {
  const { t } = useTranslation()

  const stats = [
    {
      label: t('dashboard.capitalInvested'),
      value: '1.08 tỷ',
      unit: '₫',
      sub: '12 ' + t('dashboard.buyOrders'),
      color: 'var(--heading)',
    },
    {
      label: t('dashboard.profit'),
      value: '+170M',
      unit: '₫',
      sub: '+15.74% ' + t('dashboard.vsCapital'),
      color: 'var(--positive)',
    },
    {
      label: t('dashboard.assets'),
      value: '3',
      unit: t('dashboard.assets'),
      sub: 'SJC, BTC, VNM',
      color: 'var(--heading)',
    },
  ]

  return (
    <div className="flex items-stretch rounded-xl border border-edge bg-panel">
      {stats.map((s, i) => (
        <div key={s.label} className="flex flex-1 items-center gap-4">
          <div className={`flex flex-1 flex-col gap-1 py-4 ${i === 0 ? 'pl-6' : 'pl-5'} pr-5`}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.8px] text-caption">
              {s.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className="font-['JetBrains_Mono'] text-xl font-bold tracking-tight"
                style={{ color: s.color }}
              >
                {s.value}
              </span>
              <span className="text-xs text-caption">{s.unit}</span>
            </div>
            <span className="text-[11px] text-caption">{s.sub}</span>
          </div>
          {i < stats.length - 1 && (
            <div className="h-10 w-px bg-edge" />
          )}
        </div>
      ))}
    </div>
  )
}
