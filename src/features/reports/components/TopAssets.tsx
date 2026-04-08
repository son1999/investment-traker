import { useTranslation } from 'react-i18next'
import { useTopAssets } from '@/hooks/useReports'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Period } from '@/types/api'

function formatCompact(v: number): string {
  if (Math.abs(v) >= 1e9) return (v / 1e9).toFixed(2) + 'B'
  if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + 'M'
  if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + 'k'
  return v.toLocaleString('vi-VN')
}

const assetColors: Record<string, string> = { BTC: '#f97316', SJC: '#f59e0b', ETH: '#8b5cf6', FPT: '#60a5fa', VNM: '#60a5fa' }

export default function TopAssets({ period }: { period: Period }) {
  const { t } = useTranslation()
  const { data, isLoading } = useTopAssets(period, 5)

  if (isLoading) return <Skeleton className="h-64 rounded-lg" />

  const rows = data || []

  return (
    <Card className="border-edge">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">{t('reports.topAssets')}</CardTitle>
        <Button variant="link" size="sm" className="text-xs text-caption">{t('reports.details')}</Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
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
                  <TableCell className="font-mono text-xs text-caption">{String(r.rank).padStart(2, '0')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded bg-muted"><span className="text-xs font-bold" style={{ color }}>{r.icon}</span></div>
                      <div className="flex flex-col"><span className="text-xs font-medium">{r.name}</span><span className="text-[10px] text-caption">{r.assetCode}</span></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{formatCompact(r.invested)}</TableCell>
                  <TableCell className="text-right font-mono text-xs" style={{ color: r.positive ? undefined : 'var(--negative)' }}>{formatCompact(r.currentValue)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-xs font-medium" style={{ color: r.positive ? 'var(--positive)' : 'var(--negative)' }}>{r.positive ? '+' : ''}{r.profitLossPercent.toFixed(1)}%</span>
                      <span className="text-[10px] text-muted-foreground">{r.positive ? '+' : ''}{formatCompact(r.profitLossAmount)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 pl-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${r.weight}%`, backgroundColor: color }} /></div>
                      <span className="font-mono text-[10px] text-caption">{r.weight}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
