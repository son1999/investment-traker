import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRecentTransactions } from '@/hooks/useTransactions'
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
    <Card className="border-edge bg-panel">
      <CardHeader className="flex-row items-center justify-between border-b border-edge-subtle px-8 py-6">
        <CardTitle className="text-base font-bold text-body">{t('dashboard.recentTransactions')}</CardTitle>
        <Button variant="link" size="sm" onClick={() => navigate('/transactions')} className="text-[13px] text-label">
          {t('dashboard.allTransactions')}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col p-0">
        {items.map((tx) => {
          const isBuy = tx.action === 'MUA'
          const dateStr = new Date(tx.date).toLocaleDateString('vi-VN')
          return (
            <div key={tx.id} className="flex items-center justify-between px-8 py-3 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-4">
                <span className="w-24 font-['JetBrains_Mono'] text-xs text-caption">{dateStr}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tx.icon}</span>
                  <span className="text-sm font-bold uppercase text-body">{tx.assetCode}</span>
                </div>
                <Badge variant={isBuy ? 'secondary' : 'destructive'} className={`text-[10px] font-bold ${isBuy ? 'bg-positive/10 text-positive' : ''}`}>
                  {isBuy ? t('common.buy') : t('common.sell')}
                </Badge>
              </div>
              <span className="font-['JetBrains_Mono'] text-sm font-bold text-body">{tx.quantity} {tx.assetCode}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
