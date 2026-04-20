import { useTranslation } from 'react-i18next'
import { RefreshCw } from 'lucide-react'

import { DataTableCard } from '@/components/app'
import { AssetIcon } from '@/components/ui/asset-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCurrencies } from '@/hooks/useCurrencies'
import { usePrices, useRefreshAllPrices } from '@/hooks/usePrices'

const typeLabels: Record<string, string> = {
  metal: 'common.metal',
  crypto: 'common.crypto',
  stock: 'common.stock',
  savings: 'common.savings',
}

function formatNum(value: number): string {
  return value.toLocaleString('vi-VN')
}

export default function PriceTable() {
  const { t } = useTranslation()
  const { data: prices, isLoading } = usePrices()
  const { data: currencies } = useCurrencies()
  const refresh = useRefreshAllPrices()
  const items = prices || []

  const rateMap: Record<string, number> = { VND: 1 }
  for (const current of currencies || []) {
    rateMap[current.code] = current.rateToVnd
  }

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />

  return (
    <DataTableCard
      title={t('prices.savedPrices')}
      description={`${items.length} ${t('prices.records')}`}
      action={
        <Button
          onClick={() => refresh.mutate()}
          disabled={refresh.isPending}
          size="sm"
          className="gap-2"
        >
          <RefreshCw size={14} className={refresh.isPending ? 'animate-spin' : ''} />
          {refresh.isPending ? t('prices.refreshing') : t('prices.refreshAll')}
        </Button>
      }
    >
      <div className="air-stagger-grid grid gap-3 p-4 md:hidden">
        {items.map((price) => {
          const currency = price.currency || 'VND'
          const rate = rateMap[currency] || 1
          const isVND = currency === 'VND'
          const priceInVnd = price.price * rate

          return (
            <article key={price.id} className="air-interactive-card rounded-[18px] bg-[var(--palette-surface-subtle)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AssetIcon
                    code={price.code}
                    assetType={price.type}
                    fallback={price.icon}
                    sizeClass="size-9"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{price.code}</p>
                    <Badge variant="outline" className="mt-2 uppercase">
                      {t(typeLabels[price.type] || price.type)}
                    </Badge>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(price.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-lg font-semibold">{formatNum(price.price)}</span>
                  <span className="text-xs text-muted-foreground">{isVND ? '₫' : currency}</span>
                </div>
                {!isVND ? (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">≈ {formatNum(priceInVnd)} ₫</p>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>

      <div className="hidden md:block">
        <Table className="min-w-[620px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6">{t('prices.code')}</TableHead>
              <TableHead className="px-6">{t('prices.type')}</TableHead>
              <TableHead className="px-6">{t('prices.currentPrice')}</TableHead>
              <TableHead className="px-6">{t('prices.updatedAt')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((price) => {
              const currency = price.currency || 'VND'
              const rate = rateMap[currency] || 1
              const isVND = currency === 'VND'
              const priceInVnd = price.price * rate

              return (
                <TableRow key={price.id}>
                  <TableCell className="px-6">
                    <div className="flex items-center gap-3">
                      <AssetIcon
                        code={price.code}
                        assetType={price.type}
                        fallback={price.icon}
                        sizeClass="size-8"
                      />
                      <span className="text-base font-semibold">{price.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge variant="outline" className="uppercase">
                      {t(typeLabels[price.type] || price.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-base font-semibold">
                          {formatNum(price.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {isVND ? '₫' : currency}
                        </span>
                      </div>
                      {!isVND ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          ≈ {formatNum(priceInVnd)} ₫
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 text-xs text-muted-foreground">
                    {new Date(price.updatedAt).toLocaleString('vi-VN')}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </DataTableCard>
  )
}
