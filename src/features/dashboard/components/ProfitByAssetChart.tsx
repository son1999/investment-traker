import { useTranslation } from 'react-i18next'

const profitData = [
  { symbol: 'SJC', profit: 92.5, maxWidth: 85 },
  { symbol: 'BTC', profit: 85.2, maxWidth: 78 },
  { symbol: 'ETH', profit: 12.4, maxWidth: 32 },
  { symbol: 'VNM', profit: -19.8, maxWidth: 25 },
]

export default function ProfitByAssetChart() {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col rounded-2xl border border-edge bg-panel p-5">
      <h3 className="mb-4 text-sm font-bold text-heading">{t('dashboard.profitByCode')}</h3>

      <div className="flex flex-col gap-3">
        {profitData.map((item) => {
          const positive = item.profit >= 0
          const color = positive ? '#22c55e' : '#ef4444'

          return (
            <div key={item.symbol} className="flex flex-col gap-1.5">
              {/* Label row */}
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-body">
                  {item.symbol}
                </span>
                <span
                  className="font-['JetBrains_Mono'] text-xs font-bold"
                  style={{ color }}
                >
                  {positive ? '+' : ''}{item.profit}%
                </span>
              </div>
              {/* Bar */}
              <div className={`flex h-1.5 overflow-hidden rounded-full bg-field ${!positive ? 'flex-row-reverse' : ''}`}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.maxWidth}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
