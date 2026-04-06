import { useTranslation } from 'react-i18next'

export default function AppFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-edge-subtle px-8 py-10">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between opacity-40">
        <div className="flex items-center gap-4">
          <span className="text-xs text-caption">{t('footer.copyright')}</span>
          <div className="size-1 rounded-full bg-dim" />
          <span className="text-xs text-caption">{t('footer.encryption')}</span>
        </div>
        <div className="flex gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-caption">{t('footer.policy')}</span>
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-caption">{t('footer.support')}</span>
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-caption">{t('footer.legal')}</span>
        </div>
      </div>
    </footer>
  )
}
