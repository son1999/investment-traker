import { useTranslation } from 'react-i18next'
import { useRefreshAllPrices } from '@/hooks/usePrices'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function RefreshCard() {
  const { t } = useTranslation()
  const refresh = useRefreshAllPrices()

  return (
    <Card className="border-edge">
      <CardHeader className="border-b border-edge-subtle">
        <CardTitle>{t('prices.refreshAll')}</CardTitle>
        <CardDescription>{t('prices.refreshDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <p className="text-xs text-caption">{t('prices.refreshNote')}</p>

        {refresh.data && (
          <div className="rounded-lg bg-muted/30 px-3 py-2">
            <p className="text-xs font-medium text-heading">
              {t('prices.refreshUpdated', { count: refresh.data.count })}
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {refresh.data.updated.map((item) => (
                <span key={item.code} className="rounded bg-teal-light/20 px-2 py-0.5 text-[11px] font-medium text-teal">
                  {item.code}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => refresh.mutate()}
          disabled={refresh.isPending}
          className="w-full gap-2"
        >
          <RefreshCw size={14} className={refresh.isPending ? 'animate-spin' : ''} />
          {refresh.isPending ? t('prices.refreshing') : t('prices.refreshAll')}
        </Button>
      </CardContent>
    </Card>
  )
}
