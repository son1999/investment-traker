import { useNavigate } from 'react-router-dom'
import { Database, Globe2, LockKeyhole, MoveRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import heroArtwork from '@/assets/hero.png'
import { FormField } from '@/components/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useConnectionStore } from '@/stores/connection'

export default function ConnectScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { projectUrl, anonKey, isConnecting, setProjectUrl, setAnonKey, connect } =
    useConnectionStore()

  const handleConnect = async () => {
    await connect()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1520px] gap-6 xl:grid-cols-[minmax(0,1.2fr)_480px]">
        <section className="air-surface-lg air-photo-art air-enter relative overflow-hidden px-7 py-8 sm:px-10 sm:py-10">
          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="space-y-4">
              <span className="air-kicker-pill">
                <Database size={14} />
                {t('connect.title')}
              </span>
              <div className="space-y-3">
                <h1 className="text-[clamp(2.3rem,5vw,4.4rem)] leading-[0.94] font-bold tracking-[-0.06em] text-foreground">
                  Curate the data source before you start browsing the portfolio.
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {t('connect.subtitle')}. Keep the setup precise, warm, and quiet before handing
                  the workspace to the rest of the team.
                </p>
              </div>
            </div>

            <div className="air-stagger-grid grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              <div className="air-surface air-interactive-card px-5 py-5">
                <Globe2 size={18} className="text-[var(--palette-bg-primary-core)]" />
                <p className="mt-4 text-sm font-semibold text-foreground">{t('connect.projectUrl')}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Private workspace endpoint kept locally on this browser.
                </p>
              </div>
              <div className="air-surface air-interactive-card px-5 py-5">
                <LockKeyhole size={18} className="text-[var(--palette-bg-primary-core)]" />
                <p className="mt-4 text-sm font-semibold text-foreground">{t('connect.anonKey')}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  A single onboarding step before the operational shell opens.
                </p>
              </div>
              <div className="air-surface air-interactive-card px-5 py-5">
                <MoveRight size={18} className="text-[var(--palette-bg-primary-core)]" />
                <p className="mt-4 text-sm font-semibold text-foreground">Next stop</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Login flow and full portfolio workspace.
                </p>
              </div>
            </div>
          </div>

          <img
            src={heroArtwork}
            alt=""
            className="air-hero-art pointer-events-none absolute bottom-0 right-0 hidden w-[38rem] max-w-[62%] translate-x-14 translate-y-8 opacity-90 2xl:block"
          />
        </section>

        <section className="air-surface-lg air-enter air-delay-2 flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-8">
          <div className="space-y-2">
            <span className="air-section-eyebrow">Connection Setup</span>
            <h2 className="text-[1.75rem] leading-[1.1] font-bold tracking-[-0.04em] text-foreground">
              {t('connect.heading')}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">{t('connect.description')}</p>
          </div>

          <div className="mt-8 space-y-5">
            <FormField label={t('connect.projectUrl')}>
              <Input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://xxx.supabase.co"
              />
            </FormField>
            <FormField label={t('connect.anonKey')}>
              <Input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOi..."
              />
            </FormField>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={handleConnect} disabled={isConnecting} size="lg" className="w-full">
              {isConnecting ? t('connect.submitting') : t('connect.submit')}
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/login')}>
              Continue without changing
            </Button>
          </div>

          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            {t('app.brand')} · {t('app.version')}
          </p>
        </section>
      </div>
    </div>
  )
}
