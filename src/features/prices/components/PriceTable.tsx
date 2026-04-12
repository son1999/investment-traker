import { useTranslation } from 'react-i18next'

import { DataTableCard } from '@/components/app'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCurrencies } from '@/hooks/useCurrencies'
import { usePrices } from '@/hooks/usePrices'

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
    >
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
                    <span className="text-lg">{price.icon}</span>
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
                        ≈ {formatNum(Math.round(priceInVnd))} ₫
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
    </DataTableCard>
  )
}
