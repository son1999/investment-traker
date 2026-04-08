import { useTranslation } from 'react-i18next'

export default function PriceAlertCard() {
  const { t } = useTranslation()

  return (
    <div className="flex max-w-[384px] flex-1 gap-4 rounded-lg border border-gold/30 bg-[rgba(248,160,16,0.1)] p-[17px]">
      <div className="flex size-[38px] shrink-0 items-center justify-center text-2xl">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L1 21h22L12 2z" fill="#f8a010" opacity="0.2" stroke="#f8a010" strokeWidth="1.5" />
          <path d="M12 9v5M12 16v1" stroke="#f8a010" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col gap-px">
        <span className="text-sm font-bold text-gold">{t('dashboard.priceAlert')}</span>
        <p className="pb-[7px] text-[13px] text-caption">
          {t('dashboard.priceAlertDesc')}
        </p>
        <button className="w-fit cursor-pointer bg-transparent text-xs font-bold uppercase tracking-[0.6px] text-gold hover:underline">
          {t('dashboard.updateNow')}
        </button>
      </div>
    </div>
  )
}
