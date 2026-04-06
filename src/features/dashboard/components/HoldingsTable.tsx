const holdings = [
  {
    icon: '📀',
    name: 'Vàng SJC',
    type: 'Hàng hóa',
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
    type: 'Crypto',
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
    type: 'Cổ phiếu',
    qty: '1,200',
    avgCost: '78,400',
    currentPrice: '66,100',
    value: '79.3M',
    pnl: '-15.6%',
    positive: false,
    iconBg: 'rgba(96,165,250,0.1)',
  },
]

const columns = ['Tài sản', 'Loại', 'SL', 'Giá vốn TB', 'Giá hiện tại', 'Giá trị', 'Lãi/Lỗ']

export default function HoldingsTable() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-edge bg-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-edge-subtle px-8 py-6">
        <h3 className="text-base font-bold text-body">Danh mục nắm giữ</h3>
        <button className="cursor-pointer bg-transparent text-[13px] font-medium text-label hover:underline">
          Xem chi tiết
        </button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-[rgba(19,19,22,0.5)]">
            {columns.map((col, i) => (
              <th
                key={col}
                className={`px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.55px] text-caption ${
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
                  className={`inline-block rounded-sm px-2 py-1 font-['JetBrains_Mono'] text-xs font-bold ${
                    h.positive
                      ? 'bg-positive/10 text-positive'
                      : 'bg-negative/10 text-negative'
                  }`}
                >
                  {h.pnl}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
