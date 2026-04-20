import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const workspaceLinks = ['/dashboard', '/transactions', '/reports']
const operationsLinks = ['/prices', '/assets', '/currencies']

export default function AppFooter() {
  const { t } = useTranslation()

  return (
    <footer className="mt-10 border-t border-black/6 bg-white px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1760px] gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--palette-bg-primary-core)]">
              {t('app.brand')}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-foreground">
              Portfolio operations with a calmer browsing rhythm.
            </h2>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{t('footer.copyright')}</p>
            <p>{t('footer.encryption')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Explore
          </p>
          <div className="flex flex-col gap-3 text-sm">
            {workspaceLinks.map((to) => (
              <Link key={to} to={to} className="transition-colors hover:text-[var(--palette-bg-primary-core)]">
                {t(`nav.${to.replace('/', '')}`)}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Manage
          </p>
          <div className="flex flex-col gap-3 text-sm">
            {operationsLinks.map((to) => (
              <Link key={to} to={to} className="transition-colors hover:text-[var(--palette-bg-primary-core)]">
                {t(`nav.${to.replace('/', '')}`)}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Support
          </p>
          <div className="flex flex-col gap-3 text-sm text-foreground">
            <span>{t('footer.policy')}</span>
            <span>{t('footer.support')}</span>
            <span>{t('footer.legal')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
