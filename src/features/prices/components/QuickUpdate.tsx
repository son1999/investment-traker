import { useTranslation } from 'react-i18next'

export default function QuickUpdate() {
  const { t } = useTranslation()

  const holdings = [
    { icon: '💎', code: 'TCB', cost: '32.1k', current: '34.5k' },
    { icon: '🌕', code: 'ETH', cost: '1.8k', current: '2.2k' },
    { icon: '💼', code: 'MWG', cost: '42.0k', current: '38.5k' },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-edge bg-panel">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-edge-subtle px-6 py-6">
        <h2 className="text-lg font-semibold text-heading">{t('prices.quickUpdate')}</h2>
        <p className="text-xs text-caption">{t('prices.selectFromHoldings')}</p>
      </div>

      {/* Items */}
      <div className="p-2">
        {holdings.map((h, idx) => (
          <div
            key={h.code}
            className={`flex items-center justify-between rounded px-4 py-4 ${
              idx < holdings.length - 1 ? 'border-b border-[rgba(71,71,78,0.05)]' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded bg-panel text-lg">
                {h.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-heading">{h.code}</span>
                <span className="text-[11px] text-caption">
                  {t('prices.cost')}{' '}
                  <span className="font-['JetBrains_Mono']">{h.cost}</span>
                  {' · ' + t('prices.current') + ': '}
                  <span className="font-['JetBrains_Mono']">{h.current}</span>
                </span>
              </div>
            </div>
            <button className="cursor-pointer rounded-md border border-dim bg-transparent px-3.5 py-[7px] text-[11px] font-bold uppercase tracking-[0.55px] text-body transition-colors hover:border-caption">
              {t('common.update')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
