import { useTranslation } from 'react-i18next'

export default function PromoCard() {
  const { t } = useTranslation()

  return (
    <div className="relative flex h-48 flex-col justify-end overflow-hidden rounded-lg p-8">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(153deg, rgba(255,177,72,0.2) 0%, rgba(255,177,72,0) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[#ffb148]">{t('prices.automate')}</h3>
        <p className="text-sm leading-5 text-[rgba(231,228,236,0.8)]">
          {t('prices.automateDesc')}
        </p>
      </div>
    </div>
  )
}
