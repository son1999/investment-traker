const profitData = [
  { symbol: 'SJC', profit: 92.5, maxWidth: 85 },
  { symbol: 'BTC', profit: 85.2, maxWidth: 78 },
  { symbol: 'ETH', profit: 12.4, maxWidth: 32 },
  { symbol: 'VNM', profit: -19.8, maxWidth: 25 },
]

export default function ProfitByAssetChart() {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-6">
      <h3 className="text-sm font-medium text-heading">Lợi nhuận theo mã</h3>

      <div className="flex flex-col gap-5">
        {profitData.map((item) => {
          const positive = item.profit >= 0
          const color = positive ? 'var(--positive)' : 'var(--negative)'

          return (
            <div key={item.symbol} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-body">{item.symbol}</span>
                <span className="font-mono text-xs font-medium" style={{ color }}>
                  {positive ? '+' : ''}{item.profit}M ₫
                </span>
              </div>
              <div className={`flex h-2.5 w-full overflow-hidden rounded-full bg-field ${!positive ? 'flex-row-reverse' : ''}`}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.maxWidth}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
