const entries = [
  {
    num: 8,
    title: 'Mua định kỳ Tháng 08',
    date: '15/08/2023 • 14:30',
    price: '84.200.000 ₫',
    qty: '0.245 BTC',
    total: '20.629.000 ₫',
  },
  {
    num: 7,
    title: 'Mua định kỳ Tháng 07',
    date: '15/07/2023 • 09:15',
    price: '81.500.000 ₫',
    qty: '0.251 BTC',
    total: '20.456.500 ₫',
  },
]

export default function DCAHistory() {
  return (
    <div className="flex flex-col gap-4 items-end">
      <h3 className="w-full text-xs font-bold uppercase tracking-[2.4px] text-[rgba(172,170,177,0.6)]">
        Lịch sử giao dịch DCA
      </h3>

      <div className="flex w-full flex-col gap-2">
        {entries.map((e) => (
          <div
            key={e.num}
            className="flex h-[72px] items-center justify-between rounded bg-panel p-4"
          >
            {/* Left: number + info */}
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-sm bg-field">
                <span className="font-['JetBrains_Mono'] text-base font-bold text-label">
                  #{e.num}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-body">{e.title}</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-caption">
                  {e.date}
                </span>
              </div>
            </div>

            {/* Right: metrics */}
            <div className="flex items-center gap-12">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] uppercase text-caption">Đơn giá</span>
                <span className="font-['JetBrains_Mono'] text-xs text-body">{e.price}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] uppercase text-caption">Số lượng</span>
                <span className="font-['JetBrains_Mono'] text-xs text-body">{e.qty}</span>
              </div>
              <div className="flex min-w-[100px] flex-col items-end gap-1">
                <span className="text-[10px] uppercase text-caption">Tổng tiền</span>
                <span className="font-['JetBrains_Mono'] text-sm font-bold text-body">
                  {e.total}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
