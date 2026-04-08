import { useTranslation } from 'react-i18next'
import { useHoldings } from '@/hooks/usePortfolio'
import { useUpdatePriceByCode } from '@/hooks/usePrices'

export default function QuickUpdate() {
  const { t } = useTranslation()
  const { data: holdings } = useHoldings()
  const updatePrice = useUpdatePriceByCode()

  const items = holdings || []

  const handleUpdate = async (code: string) => {
    const newPrice = prompt(`${t('prices.currentPrice')} ${code}:`)
    if (!newPrice) return
    const price = parseFloat(newPrice)
    if (isNaN(price) || price <= 0) return
    updatePrice.mutate({ code, price })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-edge bg-panel">
      <div className="flex flex-col gap-1 border-b border-edge-subtle px-6 py-6">
        <h2 className="text-lg font-semibold text-heading">{t('prices.quickUpdate')}</h2>
        <p className="text-xs text-caption">{t('prices.selectFromHoldings')}</p>
      </div>
      <div className="p-2">
        {items.map((h, idx) => (
          <div key={h.assetCode} className={`flex items-center justify-between rounded px-4 py-4 ${idx < items.length - 1 ? 'border-b border-[rgba(71,71,78,0.05)]' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded bg-panel text-lg">{h.icon}</div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-heading">{h.assetCode}</span>
                <span className="text-[11px] text-caption">
                  {t('prices.cost')} <span className="font-['JetBrains_Mono']">{h.averageCost.toLocaleString('vi-VN')}</span>
                  {' · ' + t('prices.current') + ': '}<span className="font-['JetBrains_Mono']">{h.currentPrice.toLocaleString('vi-VN')}</span>
                </span>
              </div>
            </div>
            <button onClick={() => handleUpdate(h.assetCode)} disabled={updatePrice.isPending} className="cursor-pointer rounded-md border border-dim bg-transparent px-3.5 py-[7px] text-[11px] font-bold uppercase tracking-[0.55px] text-body transition-colors hover:border-caption disabled:opacity-50">
              {t('common.update')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
