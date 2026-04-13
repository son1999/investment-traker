import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AssetIcon } from '@/components/ui/asset-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useHoldings } from '@/hooks/usePortfolio'

function formatCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `${(value / 1e6).toFixed(1)}M`
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}k`
  return value.toLocaleString('vi-VN')
}

const typeLabel: Record<string, string> = { metal: 'commodity', crypto: 'crypto', stock: 'stock' }

export default function HoldingsTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: holdings, isLoading } = useHoldings()

  const items = holdings || []
  const totalValue = items.reduce((sum, holding) => sum + holding.value, 0)
  const totalPnlAmount = items.reduce((sum, holding) => sum + holding.profitLossAmount, 0)
  const totalCost = totalValue - totalPnlAmount
  const totalPnlPct = totalCost > 0 ? (totalPnlAmount / totalCost) * 100 : 0
  const totalPositive = totalPnlPct >= 0

  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-lg" />

  return (
    <Card className="h-full w-full min-w-0 overflow-hidden border-border bg-card">
      <CardHeader className="flex-col gap-3 border-b border-border px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
        <CardTitle className="text-base font-bold text-foreground">{t('dashboard.holdings')}</CardTitle>
        <Button variant="link" size="sm" className="justify-start px-0 text-[13px] text-muted-foreground md:justify-center md:px-2.5">
          {t('dashboard.viewDetails')}
        </Button>
      </CardHeader>

      <CardContent className="p-0 md:hidden">
        <div className="flex flex-col">
          {items.map((holding) => (
            <Button
              key={holding.assetCode}
              variant="ghost"
              onClick={() => navigate(`/assets/${holding.assetCode}`)}
              className="h-auto w-full justify-start whitespace-normal rounded-none px-4 py-4"
            >
              <div className="flex w-full min-w-0 flex-col gap-3 text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <AssetIcon
                      code={holding.assetCode}
                      assetType={holding.assetType}
                      fallback={holding.icon}
                      fallbackBg={holding.iconBg}
                      sizeClass="size-9"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{holding.name}</p>
                      <p className="text-xs text-muted-foreground">{holding.assetCode}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px] uppercase">
                    {t(`common.${typeLabel[holding.assetType] || holding.assetType}`)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('dashboard.colQty')}</p>
                    <p className="font-['JetBrains_Mono'] text-foreground">
                      {holding.quantity.toLocaleString('en-US')}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-muted-foreground">{t('dashboard.colValue')}</p>
                    <p className="font-['JetBrains_Mono'] font-semibold text-foreground">
                      {formatCompact(holding.value)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                  <span className="text-xs text-muted-foreground">{t('dashboard.colPnl')}</span>
                  <Badge
                    variant={holding.positive ? 'secondary' : 'destructive'}
                    className={`gap-1 rounded-lg px-2.5 py-1 font-['JetBrains_Mono'] text-[11px] font-bold ${holding.positive ? 'bg-positive/15 text-positive' : ''}`}
                  >
                    {holding.positive ? '+' : ''}
                    {holding.profitLossPercent.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </Button>
          ))}

          {items.length > 0 ? (
            <div className="border-t bg-muted/30 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">{t('dashboard.total')}</span>
                <span className="font-['JetBrains_Mono'] text-sm font-bold text-foreground">
                  {formatCompact(totalValue)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{t('dashboard.colPnl')}</span>
                <Badge
                  variant={totalPositive ? 'secondary' : 'destructive'}
                  className={`gap-1 rounded-lg px-2.5 py-1 font-['JetBrains_Mono'] text-[11px] font-bold ${totalPositive ? 'bg-positive/15 text-positive' : ''}`}
                >
                  {totalPositive ? '+' : ''}
                  {totalPnlPct.toFixed(1)}%
                </Badge>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>

      <CardContent className="hidden p-0 md:block">
        <Table className="min-w-[780px]">
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="pl-4 sm:pl-6 md:pl-8">{t('dashboard.colAsset')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colType')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colQty')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colAvgCost')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colCurrentPrice')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colValue')}</TableHead>
              <TableHead className="pr-4 text-right sm:pr-6 md:pr-8">{t('dashboard.colPnl')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((holding) => (
              <TableRow
                key={holding.assetCode}
                onClick={() => navigate(`/assets/${holding.assetCode}`)}
                className="cursor-pointer"
              >
                <TableCell className="pl-4 sm:pl-6 md:pl-8">
                  <div className="flex items-center gap-3">
                    <AssetIcon
                      code={holding.assetCode}
                      assetType={holding.assetType}
                      fallback={holding.icon}
                      fallbackBg={holding.iconBg}
                      sizeClass="size-7"
                    />
                    <span className="text-sm font-semibold text-foreground">{holding.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {t(`common.${typeLabel[holding.assetType] || holding.assetType}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] text-foreground">
                  {holding.quantity.toLocaleString('en-US')}
                </TableCell>
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] text-foreground">
                  {formatCompact(holding.averageCost)}
                </TableCell>
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] text-foreground">
                  {formatCompact(holding.currentPrice)}
                </TableCell>
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] font-bold text-foreground">
                  {formatCompact(holding.value)}
                </TableCell>
                <TableCell className="pr-4 text-right sm:pr-6 md:pr-8">
                  <Badge
                    variant={holding.positive ? 'secondary' : 'destructive'}
                    className={`gap-1 rounded-lg px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold ${holding.positive ? 'bg-positive/15 text-positive' : ''}`}
                  >
                    {holding.positive ? '+' : ''}
                    {holding.profitLossPercent.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {items.length > 0 ? (
              <TableRow className="border-t-2 border-border bg-muted/30 hover:bg-muted/30">
                <TableCell className="pl-4 sm:pl-6 md:pl-8">
                  <span className="font-bold text-foreground">{t('dashboard.total')}</span>
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell className="text-right font-['JetBrains_Mono'] text-[13px] font-bold text-foreground">
                  {formatCompact(totalValue)}
                </TableCell>
                <TableCell className="pr-4 text-right sm:pr-6 md:pr-8">
                  <Badge
                    variant={totalPositive ? 'secondary' : 'destructive'}
                    className={`gap-1 rounded-lg px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold ${totalPositive ? 'bg-positive/15 text-positive' : ''}`}
                  >
                    {totalPositive ? '+' : ''}
                    {totalPnlPct.toFixed(1)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
