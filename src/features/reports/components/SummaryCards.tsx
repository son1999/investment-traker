const cards = [
  { label: 'Tổng nạp vốn', value: '2,450,000,000', sub: 'VND · Tính từ đầu năm' },
  { label: 'Tổng rút vốn', value: '120,500,000', sub: 'VND · Tài khoản thanh toán' },
  {
    label: 'Lãi/Lỗ đã thực hiện',
    value: '+85,340,000',
    color: 'var(--positive)',
    sub: '↑ 3.4% · Lợi nhuận chốt lời',
  },
  {
    label: 'Lãi/Lỗ chưa thực hiện',
    value: '+312,800,000',
    color: 'var(--gold)',
    sub: '↑ 12.8% · Giá trị thị trường',
  },
]

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex flex-col gap-1.5 rounded-lg border border-edge bg-panel p-5"
        >
          <span className="text-[11px] font-medium uppercase tracking-wide text-caption">
            {c.label}
          </span>
          <span
            className="font-mono text-lg font-semibold tracking-tight"
            style={{ color: c.color || 'var(--heading)' }}
          >
            {c.value}
          </span>
          <span className="text-[11px] text-dim">{c.sub}</span>
        </div>
      ))}
    </div>
  )
}
