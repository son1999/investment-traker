import { useTranslation } from 'react-i18next'
import { useDCAHistory } from '@/hooks/useReports'
import { Card, CardContent } from '@/components/ui/card'

function formatVND(v: number): string { return v.toLocaleString('vi-VN') + ' ₫' }

export default function DCAHistory({ code }: { code: string }) {
  const { t } = useTranslation()
  const { data } = useDCAHistory(code)
  const entries = data || []

  return (
    <div className="flex flex-col items-end gap-4">
      <h3 className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('reports.dcaHistoryTitle')}</h3>
      <div className="flex w-full min-w-0 flex-col gap-2">
        {entries.map(e => (
          <Card key={e.number} className="p-4">
            <CardContent className="flex w-full flex-col gap-4 p-0 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-sm bg-muted">
                  <span className="font-['JetBrains_Mono'] text-base font-bold text-muted-foreground">#{e.number}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Mua định kỳ #{e.number}</span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-muted-foreground">{new Date(e.date).toLocaleString('vi-VN')}</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:flex lg:items-center lg:gap-12">
                <div className="flex flex-col items-end gap-1"><span className="text-[10px] uppercase text-muted-foreground">{t('reports.colPrice')}</span><span className="font-['JetBrains_Mono'] text-xs">{formatVND(e.unitPrice)}</span></div>
                <div className="flex flex-col items-end gap-1"><span className="text-[10px] uppercase text-muted-foreground">{t('reports.colQty')}</span><span className="font-['JetBrains_Mono'] text-xs">{e.quantity}</span></div>
                <div className="flex min-w-0 flex-col items-end gap-1 lg:min-w-25"><span className="text-[10px] uppercase text-muted-foreground">{t('reports.colTotal')}</span><span className="font-['JetBrains_Mono'] text-sm font-bold">{formatVND(e.total)}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
