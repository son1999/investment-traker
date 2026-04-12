import { useTranslation } from 'react-i18next'
import { useConnectionStore } from '@/stores/connection'
import { FormField, SectionCard } from '@/components/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ConnectionForm() {
  const { t } = useTranslation()
  const { projectUrl, anonKey, isConnecting, setProjectUrl, setAnonKey, connect } =
    useConnectionStore()

  return (
    <SectionCard
      title={t('connect.heading')}
      description={t('connect.description')}
      className="mt-8 w-full"
      contentClassName="space-y-4"
    >
        <FormField label={t('connect.projectUrl')}>
          <Input
            type="url"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder="https://xxx.supabase.co"
            className="h-10"
          />
        </FormField>
        <FormField label={t('connect.anonKey')}>
          <Input
            type="password"
            value={anonKey}
            onChange={(e) => setAnonKey(e.target.value)}
            placeholder="eyJhbGciOi..."
            className="h-10"
          />
        </FormField>
        <Button
          onClick={connect}
          disabled={isConnecting}
          className="mt-2 h-10 w-full"
        >
          {isConnecting ? t('connect.submitting') : t('connect.submit')}
        </Button>
    </SectionCard>
  )
}
