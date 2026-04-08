import { useTranslation } from 'react-i18next'
import { useConnectionStore } from '@/stores/connection'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ConnectionForm() {
  const { t } = useTranslation()
  const { projectUrl, anonKey, isConnecting, setProjectUrl, setAnonKey, connect } =
    useConnectionStore()

  return (
    <Card className="mt-8 w-full border-edge bg-panel">
      <CardHeader className="px-6 pt-6 pb-0">
        <CardTitle className="text-sm font-medium text-heading">
          {t('connect.heading')}
        </CardTitle>
        <CardDescription className="text-sm text-caption">
          {t('connect.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 pt-5 pb-6">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-label">{t('connect.projectUrl')}</Label>
          <Input
            type="url"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder="https://xxx.supabase.co"
            className="h-9 border-edge bg-field text-sm text-heading placeholder:text-dim"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-label">{t('connect.anonKey')}</Label>
          <Input
            type="password"
            value={anonKey}
            onChange={(e) => setAnonKey(e.target.value)}
            placeholder="eyJhbGciOi..."
            className="h-9 border-edge bg-field text-sm text-heading placeholder:text-dim"
          />
        </div>
        <Button
          onClick={connect}
          disabled={isConnecting}
          className="mt-1 h-9 w-full cursor-pointer bg-btn text-sm font-medium text-on-btn hover:bg-btn-hover"
        >
          {isConnecting ? t('connect.submitting') : t('connect.submit')}
        </Button>
      </CardContent>
    </Card>
  )
}
