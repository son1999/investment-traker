import { useMemo, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { PieChart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { useAllocation } from '@/hooks/usePortfolio'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AllocationItem, AssetType } from '@/types/api'

const colors: Record<AssetType, string> = {
  metal: '#b7791f',
  crypto: '#460479',
  stock: '#ff385c',
  savings: '#008a62',
}
const EMPTY_ITEMS: AllocationItem[] = []

const CHART_SIZE = 214
const STROKE_WIDTH = 22
const ACTIVE_STROKE_WIDTH = 28
const CENTER = CHART_SIZE / 2
const RADIUS = (CHART_SIZE - ACTIVE_STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const SEGMENT_GAP = 8

interface Segment extends AllocationItem {
  color: string
  dasharray: string
  dashoffset: number
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`
}

function formatCompactCurrency(value: number) {
  const abs = Math.abs(value)
  if (abs >= 1e9) return `${(value / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}B ₫`
  if (abs >= 1e6) return `${(value / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}M ₫`
  if (abs >= 1e3) return `${(value / 1e3).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}K ₫`
  return formatCurrency(value)
}

export default function AssetAllocationChart() {
  const { t } = useTranslation()
  const { data } = useAllocation()
  const [selectedType, setSelectedType] = useState<AssetType | null>(null)
  const [hoverType, setHoverType] = useState<AssetType | null>(null)

  const items = data ?? EMPTY_ITEMS
  const rankedItems = useMemo(
    () => [...items].sort((left, right) => right.amount - left.amount),
    [items],
  )

  const totalAmount = rankedItems.reduce((sum, item) => sum + item.amount, 0)
  const totalPercent = rankedItems.reduce((sum, item) => sum + item.value, 0) || 100

  const activeType = hoverType ?? selectedType ?? rankedItems[0]?.assetType ?? null
  const activeItem = rankedItems.find((item) => item.assetType === activeType) ?? null
  const activeColor = activeItem ? colors[activeItem.assetType] : 'var(--foreground)'

  const segments = useMemo(
    () =>
      rankedItems.reduce<{ offset: number; segments: Segment[] }>(
        (accumulator, item) => {
          const sliceLength = CIRCUMFERENCE * (item.value / totalPercent)
          const visibleLength = Math.max(sliceLength - SEGMENT_GAP, 0)

          return {
            offset: accumulator.offset + sliceLength,
            segments: [
              ...accumulator.segments,
              {
                ...item,
                color: colors[item.assetType],
                dasharray: `${visibleLength} ${CIRCUMFERENCE - visibleLength}`,
                dashoffset: -accumulator.offset,
              },
            ],
          }
        },
        { offset: 0, segments: [] },
      ).segments,
    [rankedItems, totalPercent],
  )

  const handlePreview = (type: AssetType | null) => {
    setHoverType(type)
  }

  const handleSelect = (type: AssetType) => {
    setSelectedType(type)
  }

  const handleSegmentKeyDown = (event: ReactKeyboardEvent<SVGCircleElement>, type: AssetType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect(type)
    }
  }

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

      <div className="mt-6 space-y-4">
        <div
          className="rounded-[28px] px-4 py-5 sm:px-5"
          style={{
            background: `linear-gradient(180deg, ${activeColor}14 0%, rgba(255,255,255,0.98) 100%)`,
          }}
          onMouseLeave={() => handlePreview(null)}
        >
          {activeItem ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: activeColor }}
                  />
                  <p className="truncate text-sm font-semibold text-foreground">
                    {activeItem.label}
                  </p>
                </div>
                <Badge
                  className="border-white/80 bg-white/92 shadow-[var(--shadow-card)]"
                  variant="outline"
                >
                  {formatPercent(activeItem.value)}
                </Badge>
              </div>

              <div className="min-w-0">
                <p className="air-section-eyebrow">{t('dashboard.colValue')}</p>
                <p className="mt-2 break-words text-[1.45rem] leading-tight font-semibold tracking-[-0.04em] text-foreground sm:text-[1.6rem]">
                  {formatCurrency(activeItem.amount)}
                </p>
              </div>
            </div>
          ) : null}

          <div className="relative mx-auto mt-5 size-[214px]">
            <div
              className="pointer-events-none absolute inset-6 rounded-full blur-2xl transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle, ${activeColor}22 0%, transparent 72%)`,
                opacity: activeItem ? 1 : 0.45,
              }}
            />

            <svg
              viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
              className="absolute inset-0 size-full overflow-visible"
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="rgba(34,34,34,0.07)"
                strokeWidth={STROKE_WIDTH}
              />

              {segments.map((segment) => {
                const isActive = activeType === segment.assetType
                const isDimmed = activeType !== null && !isActive

                return (
                  <g key={segment.assetType}>
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      r={RADIUS}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={isActive ? ACTIVE_STROKE_WIDTH : STROKE_WIDTH}
                      strokeLinecap="round"
                      strokeDasharray={segment.dasharray}
                      strokeDashoffset={segment.dashoffset}
                      transform={`rotate(-90 ${CENTER} ${CENTER})`}
                      className="transition-[stroke-width,opacity,filter] duration-300 ease-out"
                      style={{
                        opacity: isDimmed ? 0.28 : 1,
                        filter: isActive
                          ? `drop-shadow(0 10px 22px ${segment.color}30)`
                          : undefined,
                        pointerEvents: 'none',
                      }}
                    />
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      r={RADIUS}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={40}
                      strokeLinecap="round"
                      strokeDasharray={segment.dasharray}
                      strokeDashoffset={segment.dashoffset}
                      transform={`rotate(-90 ${CENTER} ${CENTER})`}
                      className="cursor-pointer outline-none"
                      role="button"
                      tabIndex={0}
                      aria-label={`${segment.label} ${formatPercent(segment.value)}`}
                      onMouseEnter={() => handlePreview(segment.assetType)}
                      onFocus={() => handlePreview(segment.assetType)}
                      onBlur={() => handlePreview(null)}
                      onClick={() => handleSelect(segment.assetType)}
                      onKeyDown={(event) => handleSegmentKeyDown(event, segment.assetType)}
                    />
                  </g>
                )
              })}
            </svg>

            <div className="pointer-events-none absolute inset-[28px] rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(34,34,34,0.05)]" />

            <div className="pointer-events-none absolute inset-[32px] z-10 flex flex-col items-center justify-center rounded-full px-5 text-center">
              {activeItem ? (
                <>
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: activeColor }}
                    />
                    <p className="air-section-eyebrow">{activeItem.label}</p>
                  </div>
                  <p className="mt-3 text-[2.2rem] leading-none font-semibold tracking-[-0.05em] text-foreground">
                    {formatPercent(activeItem.value)}
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {formatCompactCurrency(activeItem.amount)}
                  </p>
                  <p className="mt-1 max-w-[7.75rem] text-sm leading-6 text-muted-foreground">
                    {t('dashboard.allocation').toLowerCase()}
                  </p>
                </>
              ) : (
                <>
                  <p className="air-section-eyebrow">{t('dashboard.total')}</p>
                  <p className="mt-3 text-[2rem] leading-none font-semibold tracking-[-0.05em] text-foreground">
                    {formatCompactCurrency(totalAmount)}
                  </p>
                  <p className="mt-2 max-w-[7.75rem] text-sm leading-6 text-muted-foreground">
                    {formatCurrency(totalAmount)}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-[20px] bg-white/84 px-4 py-3 shadow-[inset_0_0_0_1px_rgba(34,34,34,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="air-section-eyebrow">{t('dashboard.total')}</p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              {activeItem ? (
                <div className="text-right">
                  <p className="air-section-eyebrow">{t('reports.weight')}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatPercent(activeItem.value)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="air-stagger-list space-y-2.5">
          {rankedItems.map((item) => {
            const isActive = activeType === item.assetType
            const isSelected = selectedType === item.assetType
            const isDimmed = activeType !== null && !isActive

            return (
              <button
                key={item.assetType}
                type="button"
                aria-pressed={isSelected}
                onMouseEnter={() => handlePreview(item.assetType)}
                onMouseLeave={() => handlePreview(null)}
                onFocus={() => handlePreview(item.assetType)}
                onBlur={() => handlePreview(null)}
                onClick={() => handleSelect(item.assetType)}
                className={cn(
                  'air-interactive-card w-full rounded-[18px] px-4 py-3.5 text-left transition-all duration-300',
                  isActive
                    ? 'bg-white ring-1 ring-black/6 shadow-[var(--shadow-hover)]'
                    : 'bg-[var(--palette-surface-subtle)]',
                  isSelected && 'ring-1 ring-[color:rgba(255,56,92,0.12)]',
                  isDimmed ? 'opacity-55' : 'opacity-100',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: colors[item.assetType] }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-white/80 bg-white/92 transition-[transform,box-shadow,border-color] duration-300',
                      isActive && 'scale-[1.03] border-black/12 shadow-[var(--shadow-card)]',
                    )}
                  >
                    {formatPercent(item.value)}
                  </Badge>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70 shadow-[inset_0_0_0_1px_rgba(34,34,34,0.05)]">
                  <div
                    className="air-progress-fill h-full rounded-full"
                    style={{
                      width: `${Math.max(item.value, 6)}%`,
                      backgroundColor: colors[item.assetType],
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
