import { useTranslation } from 'react-i18next'
const logoUrl = '/logo.png'

export default function ConnectHeader() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center">
      <div className="flex size-12 items-center justify-center rounded-xl border bg-card shadow-sm">
        <img src={logoUrl} alt="" className="size-6" />
      </div>
      <div className="flex flex-col items-center gap-1 pt-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t('connect.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('connect.subtitle')}</p>
      </div>
    </div>
  )
}
