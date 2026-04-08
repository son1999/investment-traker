import { useTranslation } from 'react-i18next'
import { usePrices } from '@/hooks/usePrices'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const typeLabels: Record<string, string> = { metal: 'common.metal', crypto: 'common.crypto', stock: 'common.stock' }

export default function PriceTable() {
  const { t } = useTranslation()
  const { data: prices, isLoading } = usePrices()
  const items = prices || []

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />

  return (
    <Card className="border-edge">
      <CardHeader className="flex-row items-center justify-between border-b border-edge-subtle">
        <CardTitle>{t('prices.savedPrices')}</CardTitle>
        <span className="text-[11px] font-bold uppercase tracking-wider text-caption">{items.length} {t('prices.records')}</span>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6">{t('prices.code')}</TableHead>
              <TableHead className="px-6">{t('prices.type')}</TableHead>
              <TableHead className="px-6">{t('prices.currentPrice')}</TableHead>
              <TableHead className="px-6">{t('prices.updatedAt')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="px-6">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-base font-bold text-heading">{p.code}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6">
                  <Badge variant="outline" className="text-[10px] uppercase">{t(typeLabels[p.type] || p.type)}</Badge>
                </TableCell>
                <TableCell className="px-6 font-['JetBrains_Mono'] text-base font-bold text-heading">{p.price.toLocaleString('en-US')}</TableCell>
                <TableCell className="px-6 text-xs text-caption">{new Date(p.updatedAt).toLocaleString('vi-VN')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
