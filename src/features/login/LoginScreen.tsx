import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff } from 'lucide-react'

import { FormField, SectionCard } from '@/components/app'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
      // error is set in the store
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border bg-card shadow-sm">
            <img src={logoUrl} alt="" className="size-8" />
          </div>
          <div className="flex flex-col items-center gap-1 pt-4">
            <h1 className="text-2xl font-semibold tracking-tight">{t('login.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('login.subtitle')}</p>
          </div>
        </div>

        <SectionCard
          title={t('login.heading')}
          description={t('login.description')}
          className="mt-8 w-full"
          contentClassName="space-y-0"
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                className="h-10"
              />
            </FormField>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto shrink-0 px-0 py-0 text-xs"
                >
                  {t('login.forgotPassword')}
                </Button>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className="h-10 pr-10"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="mt-1 h-10 w-full">
              {isLoading ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>
        </SectionCard>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {t('app.brand')} &middot; {t('app.version')}
        </p>
      </div>
    </div>
  )
}
