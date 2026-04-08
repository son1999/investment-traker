import { useTranslation } from 'react-i18next'

export default function TopAssets() {
  const { t } = useTranslation()

  const rows = [
    {
      rank: '01', icon: '₿', iconColor: '#f97316', name: 'Bitcoin', code: 'BTC/VND',
      invested: '850,000,000', current: '1,060,500,000', pnl: '+24.7%', pnlAmt: '+210,500k',
      positive: true, weight: 42, weightColor: '#f97316',
    },
    {
      rank: '02', icon: 'AU', iconColor: '#f59e0b', name: 'Vàng SJC', code: 'COMMODITY',
      invested: '600,000,000', current: '631,200,000', pnl: '+5.2%', pnlAmt: '+31,200k',
      positive: true, weight: 25, weightColor: '#f59e0b',
    },
    {
      rank: '03', icon: 'FPT', iconColor: '#60a5fa', name: 'FPT Corporation', code: 'STOCK/HOSE',
      invested: '400,000,000', current: '391,600,000', pnl: '-2.1%', pnlAmt: '-8,400k',
      positive: false, weight: 15, weightColor: '#60a5fa',
    },
  ]

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-edge bg-panel p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-heading">{t('reports.topAssets')}</h3>
        <button className="cursor-pointer bg-transparent text-xs text-caption hover:text-label">
          {t('reports.details')}
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-edge">
            {['#', t('reports.asset'), t('reports.invested'), t('reports.currentValue'), t('reports.profitLoss'), t('reports.weight')].map((h, i) => (
              <th
                key={h}
                className={`pb-3 text-[11px] font-medium text-caption ${
                  i <= 1 ? 'text-left' : 'text-right'
                } ${i === 0 ? 'w-8' : ''}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.rank} className="border-t border-edge-subtle">
              <td className="py-3.5 font-mono text-xs text-caption">{r.rank}</td>
              <td className="py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded bg-field">
                    <span className="text-xs font-bold" style={{ color: r.iconColor }}>
                      {r.icon}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-body">{r.name}</span>
                    <span className="text-[10px] text-caption">{r.code}</span>
                  </div>
                </div>
              </td>
              <td className="py-3.5 text-right font-mono text-xs text-body">{r.invested}</td>
              <td
                className="py-3.5 text-right font-mono text-xs"
                style={{ color: r.positive ? 'var(--body)' : 'var(--negative)' }}
              >
                {r.current}
              </td>
              <td className="py-3.5 text-right">
                <div className="flex flex-col items-end">
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: r.positive ? 'var(--positive)' : 'var(--negative)' }}
                  >
                    {r.pnl}
                  </span>
                  <span className="text-[10px] text-dim">{r.pnlAmt}</span>
                </div>
              </td>
              <td className="py-3.5">
                <div className="flex items-center gap-2 pl-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-field">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${r.weight}%`, backgroundColor: r.weightColor }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-caption">{r.weight}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
