import { PieChart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { useAllocation } from '@/hooks/usePortfolio'
import { formatCurrency } from '@/lib/format'

const colors: Record<string, string> = {
  metal: '#b7791f',
  crypto: '#460479',
  stock: '#ff385c',
  savings: '#008a62',
}

export default function AssetAllocationChart() {
  const { t } = useTranslation()
  const { data } = useAllocation()

  const items = data || []
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)
  const gradient = items.length
    ? `conic-gradient(${items
        .map((item, index) => {
          const previous = items
            .slice(0, index)
            .reduce((sum, current) => sum + current.value, 0)
          return `${colors[item.assetType] || '#222222'} ${previous}% ${previous + item.value}%`
        })
        .join(', ')})`
    : 'conic-gradient(#f2f2f2 0% 100%)'

  return (
    <section className="air-surface px-5 py-5 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="air-section-eyebrow">{t('dashboard.allocation')}</span>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground">
            Allocation mix
          </h3>
        </div>
        <div className="flex size-11 items-center justify-center rounded-full bg-[var(--palette-surface-muted)]">
          <PieChart size={18} className="text-[var(--palette-bg-primary-core)]" />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6">
        <div
          className="relative flex size-[230px] items-center justify-center rounded-full"
          style={{ background: gradient }}
        >
          <div className="absolute inset-[22px] rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(34,34,34,0.05)]" />
          <div className="relative z-10 text-center">
            <p className="air-section-eyebrow">{t('dashboard.total')}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        <div className="w-full space-y-3">
          {items.map((item) => (
            <div key={item.assetType} className="rounded-[20px] bg-[var(--palette-surface-subtle)] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: colors[item.assetType] || '#222222' }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.amount)}</p>
                  </div>
                </div>
                <Badge variant="outline">{item.value}%</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
