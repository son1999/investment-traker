import { useTranslation } from 'react-i18next'

export default function AppFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t bg-muted/20 px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-w-0 max-w-[1400px] flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-xs">{t('footer.copyright')}</span>
          <div className="size-1 rounded-full bg-border" />
          <span className="text-xs">{t('footer.encryption')}</span>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <span className="text-[10px] font-semibold uppercase tracking-[1px]">{t('footer.policy')}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[1px]">{t('footer.support')}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[1px]">{t('footer.legal')}</span>
        </div>
      </div>
    </footer>
  )
}
