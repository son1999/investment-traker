import { useTranslation } from 'react-i18next'

export default function HoldingsTable() {
  const { t } = useTranslation()

  const holdings = [
    {
      icon: '📀',
      name: 'Vàng SJC',
      type: t('common.commodity'),
      qty: '10 Lượng',
      avgCost: '68.5M',
      currentPrice: '78.2M',
      value: '782.0M',
      pnl: '+14.1%',
      positive: true,
      iconBg: 'rgba(245,158,11,0.1)',
    },
    {
      icon: '₿',
      name: 'Bitcoin',
      type: t('common.crypto'),
      qty: '0.25',
      avgCost: '1.24B',
      currentPrice: '1.65B',
      value: '412.5M',
      pnl: '+33.0%',
      positive: true,
      iconBg: 'rgba(249,115,22,0.1)',
    },
    {
      icon: '🐄',
      name: 'Vinamilk (VNM)',
      type: t('common.stock'),
      qty: '1,200',
      avgCost: '78,400',
      currentPrice: '66,100',
      value: '79.3M',
      pnl: '-15.6%',
      positive: false,
      iconBg: 'rgba(96,165,250,0.1)',
    },
  ]

  const columns = [t('dashboard.colAsset'), t('dashboard.colType'), t('dashboard.colQty'), t('dashboard.colAvgCost'), t('dashboard.colCurrentPrice'), 'Giá trị', t('dashboard.colPnl')]
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-edge bg-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-edge-subtle px-8 py-6">
        <h3 className="text-base font-bold text-body">{t('dashboard.holdings')}</h3>
        <button className="cursor-pointer bg-transparent text-[13px] font-medium text-label hover:underline">
          {t('dashboard.viewDetails')}
        </button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-panel-alt">
            {columns.map((col, i) => (
              <th
                key={col}
                className={`px-4 py-5 text-[11px] font-bold uppercase tracking-[0.6px] text-body ${
                  i === 0 ? 'pl-8 text-left' : i === columns.length - 1 ? 'pr-8 text-right' : 'text-right'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, idx) => (
            <tr
              key={h.name}
              className={`${idx > 0 ? 'border-t border-[rgba(71,71,78,0.05)]' : ''} transition-colors hover:bg-[rgba(255,255,255,0.02)]`}
            >
              <td className="py-[18px] pl-8 pr-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-7 items-center justify-center rounded-sm text-sm"
                    style={{ backgroundColor: h.iconBg }}
                  >
                    {h.icon}
                  </div>
                  <span className="text-sm font-semibold text-body">{h.name}</span>
                </div>
              </td>
              <td className="px-4 text-right">
                <span className="rounded-sm border border-edge-strong px-[9px] py-[3px] text-[10px] font-medium uppercase text-caption">
                  {h.type}
                </span>
              </td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] text-body">
                {h.qty}
              </td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] text-body">
                {h.avgCost}
              </td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] text-body">
                {h.currentPrice}
              </td>
              <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] font-bold text-body">
                {h.value}
              </td>
              <td className="py-[18px] pl-4 pr-8 text-right">
                <span
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold transition-all ${
                    h.positive
                      ? 'bg-positive/15 text-positive shadow-sm shadow-positive/20'
                      : 'bg-negative/15 text-negative shadow-sm shadow-negative/20'
                  }`}
                >
                  {h.positive ? (
                    <svg width="10" height="10" viewBox="0 0 12 7" fill="none">
                      <path d="M1 6L6 1L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 12 7" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {h.pnl}
                </span>
              </td>
            </tr>
          ))}
          {/* Total row */}
          <tr className="border-t-2 border-edge bg-field/30">
            <td className="py-[18px] pl-8 pr-4">
              <span className="font-bold text-heading">Tổng cộng</span>
            </td>
            <td className="px-4"></td>
            <td className="px-4"></td>
            <td className="px-4"></td>
            <td className="px-4"></td>
            <td className="px-4 text-right font-['JetBrains_Mono'] text-[13px] font-bold text-heading">
              1,273.8M
            </td>
            <td className="py-[18px] pl-4 pr-8 text-right">
              <span className="inline-flex items-center gap-1 rounded-lg bg-positive/15 px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold text-positive shadow-sm shadow-positive/20">
                +12.8%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
