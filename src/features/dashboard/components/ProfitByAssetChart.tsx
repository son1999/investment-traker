import { useTranslation } from 'react-i18next'
import { AssetIcon } from '@/components/ui/asset-icon'
import { useProfitByAsset } from '@/hooks/usePortfolio'
import { formatCurrency } from '@/lib/format'

export default function ProfitByAssetChart() {
  const { t } = useTranslation()
  const { data } = useProfitByAsset()

  const items = data || []
  const sorted = [...items].sort((a, b) => b.profitPercent - a.profitPercent)

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-bold text-foreground">{t('dashboard.profitByCode')}</h3>
      <div className="min-w-0 overflow-hidden">
        <table className="w-full text-[10px] sm:text-[11px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-2 pr-1 text-left font-medium">{t('dashboard.colAsset')}</th>
              <th className="pb-2 px-1 text-right font-medium">{t('dashboard.capitalInvested')}</th>
              <th className="pb-2 px-1 text-right font-medium">{t('dashboard.colValue')}</th>
              <th className="pb-2 pl-1 text-right font-medium">{t('dashboard.colPnl')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.symbol} className="border-b border-border/50 last:border-0">
                <td className="w-17.5 max-w-17.5 py-2 pr-1 font-['JetBrains_Mono'] font-bold text-foreground sm:w-22 sm:max-w-22">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <AssetIcon
                      code={item.symbol}
                      assetType={item.assetType}
                      fallback={item.icon}
                      fallbackBg={item.iconBg}
                      sizeClass="size-5 shrink-0"
                    />
                    <span className="block min-w-0 flex-1 truncate" title={item.symbol}>
                      {item.symbol}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap py-2 px-1 text-right font-['JetBrains_Mono'] text-muted-foreground">
                  <div>{formatCurrency(item.cost ?? 0)}</div>
                  {item.currency && item.currency !== 'VND' ? (
                    <div className="text-[10px] opacity-70">
                      {formatCurrency(item.costNative ?? 0, item.currency)}
                    </div>
                  ) : null}
                </td>
                <td className="whitespace-nowrap py-2 px-1 text-right font-['JetBrains_Mono'] text-foreground">
                  <div>{formatCurrency(item.value ?? 0)}</div>
                  {item.currency && item.currency !== 'VND' ? (
                    <div className="text-[10px] text-muted-foreground opacity-70">
                      {formatCurrency(item.valueNative ?? 0, item.currency)}
                    </div>
                  ) : null}
                </td>
                <td
                  className={`whitespace-nowrap py-2 pl-1 text-right font-['JetBrains_Mono'] font-semibold ${item.positive ? 'text-positive' : 'text-negative'}`}
                >
                  <div>
                    {(item.profit ?? 0) > 0 ? '+' : ''}
                    {formatCurrency(item.profit ?? 0)}
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
