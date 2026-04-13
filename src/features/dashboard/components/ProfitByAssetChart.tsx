import { useTranslation } from 'react-i18next'
import { AssetIcon } from '@/components/ui/asset-icon'
import { useProfitByAsset } from '@/hooks/usePortfolio'

function formatVND(value: number): string {
  return value.toLocaleString('vi-VN')
}

function formatCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return formatVND(value)
}

export default function ProfitByAssetChart() {
  const { t } = useTranslation()
  const { data } = useProfitByAsset()

  const items = data || []
  const sorted = [...items].sort((a, b) => b.profitPercent - a.profitPercent)

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-bold text-foreground">{t('dashboard.profitByCode')}</h3>
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-2 pr-2 text-left font-medium">{t('dashboard.colAsset')}</th>
              <th className="pb-2 px-2 text-right font-medium">{t('dashboard.capitalInvested')}</th>
              <th className="pb-2 px-2 text-right font-medium">{t('dashboard.colValue')}</th>
              <th className="pb-2 pl-2 text-right font-medium">{t('dashboard.colPnl')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.symbol} className="border-b border-border/50 last:border-0">
                <td className="py-2 pr-2 font-['JetBrains_Mono'] font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <AssetIcon
                      code={item.symbol}
                      assetType={item.assetType}
                      fallback={item.icon}
                      fallbackBg={item.iconBg}
                      sizeClass="size-5"
                    />
                    <span>{item.symbol}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right font-['JetBrains_Mono'] text-muted-foreground">
                  <div>{formatCompact(item.cost ?? 0)} ₫</div>
                  {item.currency && item.currency !== 'VND' ? (
                    <div className="text-[10px] opacity-70">
                      {formatCompact(item.costNative ?? 0)} {item.currency}
                    </div>
                  ) : null}
                </td>
                <td className="py-2 px-2 text-right font-['JetBrains_Mono'] text-foreground">
                  <div>{formatCompact(item.value ?? 0)} ₫</div>
                  {item.currency && item.currency !== 'VND' ? (
                    <div className="text-[10px] text-muted-foreground opacity-70">
                      {formatCompact(item.valueNative ?? 0)} {item.currency}
                    </div>
                  ) : null}
                </td>
                <td
                  className={`py-2 pl-2 text-right font-['JetBrains_Mono'] font-semibold ${item.positive ? 'text-positive' : 'text-negative'}`}
                >
                  <div>
                    {item.positive ? '+' : ''}
                    {formatCompact(item.profit ?? 0)}
                  </div>
                  <div className="text-[10px] font-medium opacity-80">
                    {item.positive ? '+' : ''}
                    {item.profitPercent.toFixed(2)}%
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-muted-foreground">
                  —
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
