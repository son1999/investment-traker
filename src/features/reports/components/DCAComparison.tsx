import { useTranslation } from 'react-i18next'
import { History, Info } from 'lucide-react'

import { useDCAComparison } from '@/hooks/useReports'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

function formatVND(value: number): string {
  return `${value.toLocaleString('vi-VN')} \u20ab`
}

export default function DCAComparison({ code }: { code: string }) {
  const { t } = useTranslation()
  const { data } = useDCAComparison(code)

  if (!data) return null

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      <Card className="border-border">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
            {t('reports.dcaActual')}
          </Badge>
          <Info size={13} className="text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{t('reports.avgCost')}</span>
            <span className="font-mono text-lg font-semibold text-foreground">
              {formatVND(data.dca.avgCost)}
            </span>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase text-muted-foreground">
                {t('reports.totalCapital')}
              </span>
              <span className="font-mono text-sm">{formatVND(data.dca.totalCapital)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase text-muted-foreground">
                {t('reports.currentValue')}
              </span>
              <span className="font-mono text-sm">{formatVND(data.dca.currentValue)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{t('reports.estimatedProfit')}</span>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-mono text-base font-semibold ${
                  data.dca.profit >= 0 ? 'text-positive' : 'text-destructive'
                }`}
              >
                {data.dca.profit >= 0 ? '+' : ''}
                {formatVND(data.dca.profit)}
              </span>
              <Badge
                variant={data.dca.profitPercent >= 0 ? 'secondary' : 'destructive'}
                className={data.dca.profitPercent >= 0 ? 'bg-positive/10 text-positive' : ''}
              >
                {data.dca.profitPercent >= 0 ? '+' : ''}
                {data.dca.profitPercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            {t('reports.lumpSum')}
          </Badge>
          <History size={13} className="text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-xs italic text-muted-foreground">{t('reports.lumpSumNote')}</p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">{t('reports.priceAtThatTime')}</span>
            <span className="font-mono text-sm">{formatVND(data.lumpSum.priceAtFirstBuy)}</span>
          </div>
          <Separator />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">{t('reports.currentValue')}</span>
            <span className="font-mono text-sm">{formatVND(data.lumpSum.currentValue)}</span>
          </div>
          <Separator />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{t('reports.estimatedProfit')}</span>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-mono text-base font-semibold ${
                  data.lumpSum.profit >= 0 ? 'text-positive/70' : 'text-destructive/70'
                }`}
              >
                {data.lumpSum.profit >= 0 ? '+' : ''}
                {formatVND(data.lumpSum.profit)}
              </span>
              <Badge
                variant="outline"
                className={
                  data.lumpSum.profitPercent >= 0 ? 'text-positive/70' : 'text-destructive/70'
                }
              >
                {data.lumpSum.profitPercent >= 0 ? '+' : ''}
                {data.lumpSum.profitPercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
