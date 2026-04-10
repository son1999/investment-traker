import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useHoldings } from '@/hooks/usePortfolio'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function formatCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e9) return (value / 1e9).toFixed(2) + 'B'
  if (abs >= 1e6) return (value / 1e6).toFixed(1) + 'M'
  if (abs >= 1e3) return (value / 1e3).toFixed(1) + 'k'
  return value.toLocaleString('vi-VN')
}

const typeLabel: Record<string, string> = { metal: 'commodity', crypto: 'crypto', stock: 'stock' }

export default function HoldingsTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: holdings, isLoading } = useHoldings()

  const items = holdings || []
  const totalValue = items.reduce((s, h) => s + h.value, 0)
  const totalPnlAmount = items.reduce((s, h) => s + h.profitLossAmount, 0)
  const totalCost = totalValue - totalPnlAmount
  const totalPnlPct = totalCost > 0 ? (totalPnlAmount / totalCost) * 100 : 0
  const totalPositive = totalPnlPct >= 0

  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-lg" />

  return (
    <Card className="h-full border-edge bg-panel">
      <CardHeader className="flex-row items-center justify-between border-b border-edge-subtle px-8 py-6">
        <CardTitle className="text-base font-bold text-body">{t('dashboard.holdings')}</CardTitle>
        <Button variant="link" size="sm" className="text-[13px] text-label">{t('dashboard.viewDetails')}</Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-panel-alt hover:bg-panel-alt">
              <TableHead className="pl-8">{t('dashboard.colAsset')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colType')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colQty')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colAvgCost')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colCurrentPrice')}</TableHead>
              <TableHead className="text-right">Giá trị</TableHead>
              <TableHead className="pr-8 text-right">{t('dashboard.colPnl')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((h) => (
              <TableRow key={h.assetCode} onClick={() => navigate(`/assets/${h.assetCode}`)} className="cursor-pointer">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-sm text-sm" style={{ backgroundColor: h.iconBg }}>{h.icon}</div>
                    <span className="text-sm font-semibold text-body">{h.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="text-[10px] uppercase">{t(`common.${typeLabel[h.assetType] || h.assetType}`)}</Badge>
                </TableCell>
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] text-body">{h.quantity.toLocaleString('en-US')}</TableCell>
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] text-body">{formatCompact(h.averageCost)}</TableCell>
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] text-body">{formatCompact(h.currentPrice)}</TableCell>
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] font-bold text-body">{formatCompact(h.value)}</TableCell>
                <TableCell className="pr-8 text-right">
                  <Badge variant={h.positive ? 'secondary' : 'destructive'} className={`gap-1 rounded-lg px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold ${h.positive ? 'bg-positive/15 text-positive' : ''}`}>
                    {h.positive ? '▲' : '▼'} {h.positive ? '+' : ''}{h.profitLossPercent.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {items.length > 0 && (
              <TableRow className="border-t-2 border-edge bg-field/30 hover:bg-field/30">
                <TableCell className="pl-8"><span className="font-bold text-heading">Tổng cộng</span></TableCell>
                <TableCell /><TableCell /><TableCell /><TableCell />
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] font-bold text-heading">{formatCompact(totalValue)}</TableCell>
                <TableCell className="pr-8 text-right">
                  <Badge variant={totalPositive ? 'secondary' : 'destructive'} className={`gap-1 rounded-lg px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold ${totalPositive ? 'bg-positive/15 text-positive' : ''}`}>
                    {totalPositive ? '+' : ''}{totalPnlPct.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
