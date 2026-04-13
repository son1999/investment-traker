import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRecentTransactions } from '@/hooks/useTransactions'
import { AssetIcon } from '@/components/ui/asset-icon'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function RecentTransactions() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: transactions, isLoading } = useRecentTransactions()

  if (isLoading) return <Skeleton className="h-[200px] w-full rounded-lg" />

  const items = transactions || []

  return (
    <Card className="w-full min-w-0 border-border bg-card">
      <CardHeader className="flex-col gap-3 border-b border-border px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
        <CardTitle className="text-base font-bold text-foreground">{t('dashboard.recentTransactions')}</CardTitle>
        <Button variant="link" size="sm" onClick={() => navigate('/transactions')} className="text-[13px] text-muted-foreground">
          {t('dashboard.allTransactions')}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col p-0">
        {items.map((tx) => {
          const isBuy = tx.action === 'MUA'
          const dateStr = new Date(tx.date).toLocaleDateString('vi-VN')
          return (
            <div key={tx.id} className="flex flex-col gap-3 px-4 py-3 transition-colors hover:bg-muted/50 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <span className="font-['JetBrains_Mono'] text-xs text-muted-foreground sm:w-24">{dateStr}</span>
                <div className="flex items-center gap-2">
                  <AssetIcon
                    code={tx.assetCode}
                    assetType={tx.assetType}
                    fallback={tx.icon}
                    sizeClass="size-6"
                  />
                  <span className="text-sm font-bold uppercase text-foreground">{tx.assetCode}</span>
                </div>
                <Badge variant={isBuy ? 'secondary' : 'destructive'} className={`text-[10px] font-bold ${isBuy ? 'bg-positive/10 text-positive' : ''}`}>
                  {isBuy ? t('common.buy') : t('common.sell')}
                </Badge>
              </div>
              <span className="font-['JetBrains_Mono'] text-sm font-bold text-foreground">{tx.quantity} {tx.assetCode}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
