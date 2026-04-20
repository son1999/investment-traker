import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff, ShieldCheck, Sparkles, WalletCards } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import heroArtwork from '@/assets/hero.png'
import { FormField } from '@/components/app'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'

const logoUrl = '/logo.png'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useAuthStore()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      // error state comes from store
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1520px] gap-6 xl:grid-cols-[minmax(0,1.15fr)_480px]">
        <section className="air-surface-lg air-photo-art relative overflow-hidden px-7 py-8 sm:px-10 sm:py-10">
          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="space-y-4">
              <span className="air-kicker-pill">
                <Sparkles size={14} />
                {t('app.brand')}
              </span>
              <div className="space-y-3">
                <h1 className="text-[clamp(2.3rem,5vw,4.6rem)] leading-[0.94] font-bold tracking-[-0.06em] text-foreground">
                  Browse every asset like a curated stay, then act only when the numbers are ready.
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {t('login.subtitle')}. The workspace is structured for slow review, clear
                  pricing, and confident portfolio decisions.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              <div className="air-surface px-5 py-5">
                <WalletCards size={18} className="text-[var(--palette-bg-primary-core)]" />
                <p className="mt-4 text-sm font-semibold text-foreground">{t('nav.assets')}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Listing-style browsing for every holding in the book.
                </p>
              </div>
              <div className="air-surface px-5 py-5">
                <ShieldCheck size={18} className="text-[var(--palette-bg-primary-core)]" />
                <p className="mt-4 text-sm font-semibold text-foreground">{t('nav.reports')}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Performance, cashflow, and rebalancing in one warm shell.
                </p>
              </div>
              <div className="air-surface px-5 py-5">
                <Sparkles size={18} className="text-[var(--palette-bg-primary-core)]" />
                <p className="mt-4 text-sm font-semibold text-foreground">{t('nav.prices')}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Focused update flows for market prices and portfolio context.
                </p>
              </div>
            </div>
          </div>

          <img
            src={heroArtwork}
            alt=""
            className="pointer-events-none absolute bottom-0 right-0 hidden w-[38rem] max-w-[62%] translate-x-14 translate-y-8 opacity-90 2xl:block"
          />
        </section>

        <section className="air-surface-lg flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-8">
          <div className="space-y-4">
            <img src={logoUrl} alt="" className="h-11 w-auto" />
            <div className="space-y-2">
              <span className="air-section-eyebrow">{t('login.title')}</span>
              <h2 className="text-[1.85rem] leading-[1.08] font-bold tracking-[-0.04em] text-foreground">
                {t('login.heading')}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">{t('login.description')}</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <FormField label={t('login.email')}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
              />
            </FormField>

            <FormField label={t('login.password')}>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className="pr-14"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </FormField>

            <Button type="submit" disabled={isLoading} size="lg" className="mt-2 w-full">
              {isLoading ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{t('app.brand')}</span>
            <Button variant="link" size="sm" className="h-auto p-0">
              {t('login.forgotPassword')}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
