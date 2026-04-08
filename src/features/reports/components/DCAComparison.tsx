import { useTranslation } from 'react-i18next'
import { Info, History } from 'lucide-react'
import { useDCAComparison } from '@/hooks/useReports'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function formatVND(v: number): string { return v.toLocaleString('vi-VN') + ' ₫' }

export default function DCAComparison({ code }: { code: string }) {
  const { t } = useTranslation()
  const { data } = useDCAComparison(code)
  if (!data) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* DCA Card */}
      <Card className="border-edge">
        <CardHeader className="flex-row items-center justify-between">
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">{t('reports.dcaActual')}</Badge>
          <Info size={13} className="text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-caption">{t('reports.avgCost')}</span>
            <span className="font-mono text-lg font-semibold text-heading">{formatVND(data.dca.avgCost)}</span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5"><span className="text-[10px] uppercase text-caption">{t('reports.totalCapital')}</span><span className="font-mono text-sm">{formatVND(data.dca.totalCapital)}</span></div>
            <div className="flex flex-col gap-0.5"><span className="text-[10px] uppercase text-caption">{t('reports.currentValue')}</span><span className="font-mono text-sm">{formatVND(data.dca.currentValue)}</span></div>
          </div>
          <Separator />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-caption">{t('reports.estimatedProfit')}</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-base font-semibold ${data.dca.profit >= 0 ? 'text-positive' : 'text-destructive'}`}>{data.dca.profit >= 0 ? '+' : ''}{formatVND(data.dca.profit)}</span>
              <Badge variant={data.dca.profitPercent >= 0 ? 'secondary' : 'destructive'} className={data.dca.profitPercent >= 0 ? 'bg-positive/10 text-positive' : ''}>
                {data.dca.profitPercent >= 0 ? '+' : ''}{data.dca.profitPercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lump Sum Card */}
      <Card className="border-edge-subtle">
        <CardHeader className="flex-row items-center justify-between">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{t('reports.lumpSum')}</Badge>
          <History size={13} className="text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-xs italic text-caption">{t('reports.lumpSumNote')}</p>
          <div className="flex items-center justify-between"><span className="text-xs text-caption">{t('reports.priceAtThatTime')}</span><span className="font-mono text-sm">{formatVND(data.lumpSum.priceAtFirstBuy)}</span></div>
          <Separator />
          <div className="flex items-center justify-between"><span className="text-xs text-caption">{t('reports.currentValue')}</span><span className="font-mono text-sm">{formatVND(data.lumpSum.currentValue)}</span></div>
          <Separator />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-caption">{t('reports.estimatedProfit')}</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-base font-semibold ${data.lumpSum.profit >= 0 ? 'text-positive/70' : 'text-destructive/70'}`}>{data.lumpSum.profit >= 0 ? '+' : ''}{formatVND(data.lumpSum.profit)}</span>
              <Badge variant="outline" className={data.lumpSum.profitPercent >= 0 ? 'text-positive/70' : 'text-destructive/70'}>
                {data.lumpSum.profitPercent >= 0 ? '+' : ''}{data.lumpSum.profitPercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
