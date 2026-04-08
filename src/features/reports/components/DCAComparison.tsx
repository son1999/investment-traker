import { useTranslation } from 'react-i18next'
import { Info, History } from 'lucide-react'

export default function DCAComparison() {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* DCA Card */}
      <div className="flex flex-col gap-5 rounded-lg border border-edge bg-panel p-5">
        <div className="flex items-center justify-between">
          <span className="rounded bg-field px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-label">
            {t('reports.dcaActual')}
          </span>
          <Info size={13} className="text-dim" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-caption">{t('reports.avgCost')}</span>
            <span className="font-mono text-lg font-semibold text-heading">82.500.000 ₫</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-edge py-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase text-caption">{t('reports.totalCapital')}</span>
              <span className="font-mono text-sm text-body">165.000.000 ₫</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase text-caption">{t('reports.currentValue')}</span>
              <span className="font-mono text-sm text-body">190.000.000 ₫</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-caption">{t('reports.estimatedProfit')}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-semibold text-positive">+25.000.000 ₫</span>
              <span className="rounded bg-positive/10 px-1.5 py-0.5 text-[11px] font-medium text-positive">
                +15.15%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lump Sum Card */}
      <div className="flex flex-col gap-5 rounded-lg border border-edge-subtle bg-panel p-5">
        <div className="flex items-center justify-between">
          <span className="rounded bg-field px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-caption">
            {t('reports.lumpSum')}
          </span>
          <History size={13} className="text-dim" />
        </div>

        <p className="text-xs italic text-caption">{t('reports.lumpSumNote')}</p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-caption">{t('reports.priceAtThatTime')}</span>
            <span className="font-mono text-sm text-body">78.000.000 ₫</span>
          </div>

          <div className="flex items-center justify-between border-y border-edge py-4">
            <span className="text-xs text-caption">{t('reports.currentValue')}</span>
            <span className="font-mono text-sm text-body">190.000.000 ₫</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-caption">{t('reports.estimatedProfit')}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-semibold text-positive/70">+34.000.000 ₫</span>
              <span className="rounded bg-positive/5 px-1.5 py-0.5 text-[11px] font-medium text-positive/70">
                +21.80%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
