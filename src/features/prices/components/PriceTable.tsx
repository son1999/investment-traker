import { useTranslation } from 'react-i18next'
import { usePricesStore } from '@/stores/prices'

export default function PriceTable() {
  const { t } = useTranslation()
  const { prices } = usePricesStore()

  return (
    <div className="overflow-hidden rounded-lg border border-edge bg-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-edge-subtle px-6 py-6">
        <h2 className="text-lg font-semibold text-heading">{t('prices.savedPrices')}</h2>
        <span className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
          {prices.length} {t('prices.records')}
        </span>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-panel">
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
              {t('prices.code')}
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
              {t('prices.type')}
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
              {t('prices.currentPrice')}
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
              {t('prices.updatedAt')}
            </th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p, idx) => (
            <tr
              key={p.id}
              className={`${idx > 0 ? 'border-t border-[rgba(71,71,78,0.05)]' : ''} transition-colors hover:bg-[rgba(255,255,255,0.02)]`}
            >
              <td className="py-5 pl-6">
                <div className="flex items-center gap-3">
                  <span className="text-lg text-body">{p.icon}</span>
                  <span className="text-base font-bold text-heading">{p.code}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="rounded-xl border border-dim px-3 py-1.5 text-[10px] font-bold uppercase text-caption">
                  {p.type}
                </span>
              </td>
              <td className="px-6 py-5 font-['JetBrains_Mono'] text-base font-bold text-heading">
                {p.price.toLocaleString('en-US')}
              </td>
              <td className="px-6 py-5 text-xs text-caption">{p.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
