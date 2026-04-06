import { useTranslation } from 'react-i18next'
import iconSvg from '@/assets/icon.svg'

export default function ConnectHeader() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center">
      <div className="flex size-10 items-center justify-center rounded-md border border-edge bg-panel">
        <img src={iconSvg} alt="" className="size-4" />
      </div>
      <div className="flex flex-col items-center gap-1 pt-4">
        <h1 className="text-xl font-semibold text-heading">{t('connect.title')}</h1>
        <p className="text-sm text-caption">{t('connect.subtitle')}</p>
      </div>
    </div>
  )
}
