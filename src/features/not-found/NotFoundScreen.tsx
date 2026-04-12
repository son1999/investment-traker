import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export default function NotFoundScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-[400px] flex-col items-center text-center">
        <span className="font-mono text-8xl font-bold text-muted-foreground/40">404</span>
        <h1 className="mt-4 text-lg font-semibold">{t('notFound.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('notFound.description')}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            {t('notFound.goBack')}
          </Button>
          <Button onClick={() => navigate('/dashboard')}>{t('notFound.goHome')}</Button>
        </div>
        <p className="mt-16 text-center text-xs text-muted-foreground">
          {t('app.brand')} &middot; {t('app.version')}
        </p>
      </div>
    </div>
  )
}
