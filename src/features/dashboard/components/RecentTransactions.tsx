const transactions = [
  { date: '12/10/2023', icon: '📀', symbol: 'SJC', type: 'MUA' as const, amount: '2 Lượng' },
  { date: '10/10/2023', icon: '₿', symbol: 'BTC', type: 'MUA' as const, amount: '0.05 BTC' },
  { date: '05/10/2023', icon: '🐄', symbol: 'VNM', type: 'BÁN' as const, amount: '500 CP' },
  { date: '01/10/2023', icon: '💎', symbol: 'ETH', type: 'MUA' as const, amount: '1.2 ETH' },
  { date: '28/09/2023', icon: '📀', symbol: 'SJC', type: 'MUA' as const, amount: '1 Lượng' },
]

export default function RecentTransactions() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-edge bg-panel pb-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-edge-subtle px-8 py-6">
        <h3 className="text-base font-bold text-body">Giao dịch gần đây</h3>
        <button className="cursor-pointer bg-transparent text-[13px] font-medium text-label hover:underline">
          Tất cả giao dịch
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {transactions.map((tx, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded px-8 py-4 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
          >
            <div className="flex items-center gap-4">
              <span className="w-24 font-['JetBrains_Mono'] text-xs text-caption">
                {tx.date}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{tx.icon}</span>
                <span className="text-sm font-bold uppercase text-body">{tx.symbol}</span>
              </div>
              <span
                className={`rounded-sm px-2 py-[2px] text-[10px] font-bold ${
                  tx.type === 'MUA'
                    ? 'bg-positive/10 text-positive'
                    : 'bg-negative/10 text-negative'
                }`}
              >
                {tx.type}
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-sm font-bold text-body">
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
