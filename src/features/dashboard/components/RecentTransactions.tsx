import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AssetIcon } from '@/components/ui/asset-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentTransactions } from '@/hooks/useTransactions'

export default function RecentTransactions() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: transactions, isLoading } = useRecentTransactions()

  if (isLoading) return <Skeleton className="h-64 w-full rounded-[20px]" />

  const items = transactions || []

  return (
    <section className="air-surface overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-black/5 px-6 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <span className="air-section-eyebrow">{t('dashboard.recentTransactions')}</span>
          <h3 className="text-[1.7rem] leading-[1.1] font-semibold tracking-[-0.04em] text-foreground">
            The latest movements across your book.
          </h3>
        </div>
        <Button variant="outline" size="lg" onClick={() => navigate('/transactions')}>
          {t('dashboard.allTransactions')}
        </Button>
      </div>

      <div className="divide-y divide-black/5">
        {items.map((tx) => {
          const isBuy = tx.action === 'MUA'

          return (
            <button
              key={tx.id}
              type="button"
              onClick={() => navigate('/transactions')}
              className="flex w-full flex-col gap-4 px-6 py-5 text-left transition-colors hover:bg-[rgba(34,34,34,0.02)] sm:px-8 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex items-start gap-4">
                <AssetIcon
                  code={tx.assetCode}
                  assetType={tx.assetType}
                  fallback={tx.icon}
                  fallbackBg={tx.iconBg}
                  sizeClass="size-11"
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-base font-semibold text-foreground">{tx.assetCode}</p>
                    <Badge variant={isBuy ? 'default' : 'destructive'}>
                      {isBuy ? t('common.buy') : t('common.sell')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('vi-VN')} · {tx.note || t('transactions.title')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 lg:min-w-[220px] lg:justify-end">
                <p className="text-sm font-medium text-foreground">
                  {tx.quantity.toLocaleString('en-US')} {tx.assetCode}
                </p>
                <ArrowRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
