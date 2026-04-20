import { House, Undo2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export default function NotFoundScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="air-surface-lg air-photo-art air-enter mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1120px] flex-col items-center justify-center px-8 py-12 text-center">
        <span className="air-kicker-pill">404</span>
        <h1 className="mt-6 max-w-3xl text-[clamp(2.6rem,7vw,5rem)] leading-[0.92] font-bold tracking-[-0.06em] text-foreground">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {t('notFound.description')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
            <Undo2 size={15} />
            {t('notFound.goBack')}
          </Button>
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            <House size={15} />
            {t('notFound.goHome')}
          </Button>
        </div>
        <p className="mt-10 text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t('app.brand')} · {t('app.version')}
        </p>
      </div>
    </div>
  )
}
