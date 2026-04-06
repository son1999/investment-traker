import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export default function NotFoundScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6">
      <div className="flex w-full max-w-[400px] flex-col items-center text-center">
        <span className="font-mono text-8xl font-bold text-dim">404</span>
        <h1 className="mt-4 text-lg font-semibold text-heading">{t('notFound.title')}</h1>
        <p className="mt-1 text-sm text-caption">{t('notFound.description')}</p>
        <div className="mt-8 flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="cursor-pointer border-edge text-body hover:bg-edge-subtle">
            {t('notFound.goBack')}
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="cursor-pointer bg-btn text-on-btn hover:bg-btn-hover">
            {t('notFound.goHome')}
          </Button>
        </div>
        <p className="mt-16 text-xs text-dim">{t('app.brand')} &middot; {t('app.version')}</p>
      </div>
    </div>
  )
}
