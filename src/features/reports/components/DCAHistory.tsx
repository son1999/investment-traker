import { useTranslation } from 'react-i18next'
import { useDCAHistory } from '@/hooks/useReports'

function formatVND(v: number): string { return v.toLocaleString('vi-VN') + ' ₫' }

export default function DCAHistory({ code }: { code: string }) {
  const { t } = useTranslation()
  const { data } = useDCAHistory(code)
  const entries = data || []

  return (
    <div className="flex flex-col gap-4 items-end">
      <h3 className="w-full text-xs font-bold uppercase tracking-[2.4px] text-[rgba(172,170,177,0.6)]">{t('reports.dcaHistoryTitle')}</h3>
      <div className="flex w-full flex-col gap-2">
        {entries.map((e) => (
          <div key={e.number} className="flex h-[72px] items-center justify-between rounded bg-panel p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-sm bg-field"><span className="font-['JetBrains_Mono'] text-base font-bold text-label">#{e.number}</span></div>
              <div className="flex flex-col"><span className="text-sm font-semibold text-body">Mua định kỳ #{e.number}</span><span className="font-['JetBrains_Mono'] text-[10px] text-caption">{new Date(e.date).toLocaleString('vi-VN')}</span></div>
            </div>
            <div className="flex items-center gap-12">
              <div className="flex flex-col items-end gap-1"><span className="text-[10px] uppercase text-caption">{t('reports.colPrice')}</span><span className="font-['JetBrains_Mono'] text-xs text-body">{formatVND(e.unitPrice)}</span></div>
              <div className="flex flex-col items-end gap-1"><span className="text-[10px] uppercase text-caption">{t('reports.colQty')}</span><span className="font-['JetBrains_Mono'] text-xs text-body">{e.quantity}</span></div>
              <div className="flex min-w-[100px] flex-col items-end gap-1"><span className="text-[10px] uppercase text-caption">{t('reports.colTotal')}</span><span className="font-['JetBrains_Mono'] text-sm font-bold text-body">{formatVND(e.total)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
