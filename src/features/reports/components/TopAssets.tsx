import { useTranslation } from 'react-i18next'
import { useTopAssets } from '@/hooks/useReports'
import { AssetIcon } from '@/components/ui/asset-icon'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Period } from '@/types/api'
import { formatCurrency } from '@/lib/format'

const assetColors: Record<string, string> = { BTC: '#f97316', SJC: '#f59e0b', ETH: '#8b5cf6', FPT: '#60a5fa', VNM: '#60a5fa' }

export default function TopAssets({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = useTopAssets(period, 5)

  if (isLoading) return <Skeleton className="h-64 rounded-lg" />

  const rows = data || []

  return (
    <Card className="w-full min-w-0 border-border">
      <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-sm">{t('reports.topAssets')}</CardTitle>
        <Button variant="link" size="sm" className="justify-start px-0 text-xs text-muted-foreground md:justify-center md:px-2.5">{t('reports.details')}</Button>
      </CardHeader>
      <CardContent className="min-w-0 p-0">
        <div className="air-stagger-grid grid gap-3 p-4 md:hidden">
          {rows.map((r) => {
            const color = assetColors[r.assetCode] || '#888'
            return (
              <article key={r.rank} className="air-interactive-card rounded-[18px] bg-[var(--palette-surface-subtle)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AssetIcon
                      code={r.assetCode}
                      assetType={r.assetType}
                      fallback={r.icon}
                      sizeClass="size-9"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.assetCode}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">#{String(r.rank).padStart(2, '0')}</span>
                </div>
                <div className="mt-4 grid gap-3 text-xs min-[420px]:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">{t('reports.invested')}</p>
                    <p className="mt-1 font-mono text-foreground">{formatCurrency(r.invested)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">{t('reports.currentValue')}</p>
                    <p className="mt-1 font-mono text-foreground">{formatCurrency(r.currentValue)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-muted-foreground">{t('reports.profitLoss')}</p>
                    <p className="mt-1 font-mono text-xs" style={{ color: r.positive ? 'var(--positive)' : 'var(--negative)' }}>
                      {r.positive ? '+' : ''}{r.profitLossPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex min-w-24 items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="air-progress-fill h-full rounded-full" style={{ width: `${r.weight}%`, backgroundColor: color }} />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">{r.weight}%</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="hidden md:block">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8">#</TableHead>
                <TableHead>{t('reports.asset')}</TableHead>
                <TableHead className="text-right">{t('reports.invested')}</TableHead>
                <TableHead className="text-right">{t('reports.currentValue')}</TableHead>
                <TableHead className="text-right">{t('reports.profitLoss')}</TableHead>
                <TableHead className="text-right">{t('reports.weight')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => {
                const color = assetColors[r.assetCode] || '#888'
                return (
                  <TableRow key={r.rank}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{String(r.rank).padStart(2, '0')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <AssetIcon
                          code={r.assetCode}
                          assetType={r.assetType}
                          fallback={r.icon}
                          sizeClass="size-7"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{r.name}</span>
                          <span className="text-[10px] text-muted-foreground">{r.assetCode}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{formatCurrency(r.invested)}</TableCell>
                    <TableCell className="text-right font-mono text-xs" style={{ color: r.positive ? undefined : 'var(--negative)' }}>{formatCurrency(r.currentValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-xs font-medium" style={{ color: r.positive ? 'var(--positive)' : 'var(--negative)' }}>{r.positive ? '+' : ''}{r.profitLossPercent.toFixed(1)}%</span>
                        <span className="text-[10px] text-muted-foreground">{r.profitLossAmount > 0 ? '+' : ''}{formatCurrency(r.profitLossAmount)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 pl-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="air-progress-fill h-full rounded-full" style={{ width: `${r.weight}%`, backgroundColor: color }} /></div>
                        <span className="font-mono text-[10px] text-muted-foreground">{r.weight}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
