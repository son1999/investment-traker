import { useTranslation } from 'react-i18next'
import DataBackup from './components/DataBackup'
import CloudConnection from './components/CloudConnection'
import DangerZone from './components/DangerZone'

export default function SettingsScreen() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-heading">{t('settings.title')}</h1>
        <p className="text-sm text-caption">{t('settings.subtitle')}</p>
      </div>
      <div className="flex max-w-[640px] flex-col gap-5">
        <DataBackup />
        <CloudConnection />
        <DangerZone />
      </div>
    </div>
  )
}
