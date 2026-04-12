import { useTranslation } from 'react-i18next'
import { RefreshCw } from 'lucide-react'

import { SectionCard, StatusBadge } from '@/components/app'
import { Button } from '@/components/ui/button'
import { useRefreshAllPrices } from '@/hooks/usePrices'

export default function RefreshCard() {
  const { t } = useTranslation()
  const refresh = useRefreshAllPrices()

  return (
    <SectionCard title={t('prices.refreshAll')} description={t('prices.refreshDesc')}>
      <p className="text-xs text-muted-foreground">{t('prices.refreshNote')}</p>

      {refresh.data ? (
        <div className="rounded-lg border bg-muted/30 px-3 py-2">
          <p className="text-sm font-medium">
            {t('prices.refreshUpdated', { count: refresh.data.count })}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {refresh.data.updated.map((item) => (
              <StatusBadge key={item.code} tone="neutral">
                {item.code}
              </StatusBadge>
            ))}
          </div>
        </div>
      ) : null}

      <Button onClick={() => refresh.mutate()} disabled={refresh.isPending} className="w-full gap-2">
        <RefreshCw size={14} className={refresh.isPending ? 'animate-spin' : ''} />
        {refresh.isPending ? t('prices.refreshing') : t('prices.refreshAll')}
      </Button>
    </SectionCard>
  )
}
