import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
const logoUrl = '/logo.png'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="flex size-10 items-center justify-center rounded-md border border-edge bg-panel">
            <img src={logoUrl} alt="" className="size-8" />
          </div>
          <div className="flex flex-col items-center gap-1 pt-4">
            <h1 className="text-xl font-semibold text-heading">{t('login.title')}</h1>
            <p className="text-sm text-caption">{t('login.subtitle')}</p>
          </div>
        </div>

        <Card className="mt-8 w-full border-edge bg-panel">
          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle className="text-sm font-medium text-heading">{t('login.heading')}</CardTitle>
            <CardDescription className="text-sm text-caption">{t('login.description')}</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pt-5 pb-6">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-label">{t('login.email')}</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.emailPlaceholder')}
                  className="h-9 border-edge bg-field text-sm text-heading placeholder:text-dim"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-label">{t('login.password')}</Label>
                  <button type="button" className="cursor-pointer bg-transparent text-xs text-caption transition-colors hover:text-label">
                    {t('login.forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    className="h-9 border-edge bg-field pr-10 text-sm text-heading placeholder:text-dim"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent text-dim transition-colors hover:text-label"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="mt-1 h-9 w-full cursor-pointer bg-btn text-sm font-medium text-on-btn hover:bg-btn-hover">
                {isLoading ? t('login.submitting') : t('login.submit')}
              </Button>
            </form>

          </CardContent>
        </Card>

        <p className="mt-10 text-xs text-dim">{t('app.brand')} &middot; {t('app.version')}</p>
      </div>
    </div>
  )
}
