import { useState } from 'react'
import { BarChart3, CheckCircle2, Clock, Info, LayoutGrid, PieChart, RefreshCw, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAllocationRecommendation, useCurrentAllocation, useSetAllocationTargets } from '@/hooks/useAllocation'
import { useIsGuest } from '@/hooks/useIsGuest'
import type { AssetType } from '@/types/api'

const statusColors: Record<string, string> = {
  metal: '#b7791f',
  crypto: '#460479',
  stock: '#ff385c',
}

export default function AllocationScreen() {
  const { t } = useTranslation()
  const isGuest = useIsGuest()
  const { data: allocations } = useCurrentAllocation()
  const { data: recommendation } = useAllocationRecommendation()
  const setTargetsMut = useSetAllocationTargets()

  const sidebarLinks = [
    { icon: LayoutGrid, label: t('allocation.sidebarOverview') },
    { icon: PieChart, label: t('allocation.sidebarAllocation') },
    { icon: RefreshCw, label: t('allocation.sidebarRebalance') },
    { icon: Clock, label: t('allocation.sidebarHistory') },
    { icon: BarChart3, label: t('allocation.sidebarAnalysis') },
  ]

  const items = allocations || []
  const [targets, setTargets] = useState({ metal: '30', crypto: '25', stock: '45' })
  const total = (parseInt(targets.metal) || 0) + (parseInt(targets.crypto) || 0) + (parseInt(targets.stock) || 0)

  const statusBadge: Record<string, { variant: 'default' | 'destructive' | 'outline'; label: string }> = {
    overweight: { variant: 'default', label: t('allocation.overweight') },
    underweight: { variant: 'destructive', label: t('allocation.underweight') },
    'on-target': { variant: 'outline', label: t('allocation.balanced') },
  }

  const handleSave = () => {
    if (total !== 100) return
    setTargetsMut.mutate([
      { assetType: 'metal' as AssetType, targetPercent: parseInt(targets.metal) || 0 },
      { assetType: 'crypto' as AssetType, targetPercent: parseInt(targets.crypto) || 0 },
      { assetType: 'stock' as AssetType, targetPercent: parseInt(targets.stock) || 0 },
    ])
  }

  return (
    <div className="air-page grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="air-surface-lg px-5 py-6 sm:px-6">
        <div className="space-y-2">
          <span className="air-section-eyebrow">{t('allocation.sidebarMenu')}</span>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
            {t('allocation.title')}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t('allocation.premium')}</p>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {sidebarLinks.map((link, index) => (
            <Button
              key={link.label}
              variant={index === 1 ? 'secondary' : 'ghost'}
              className="justify-start"
            >
              <link.icon size={15} />
              {link.label}
            </Button>
          ))}
        </nav>

        <Button variant="outline" className="mt-6 w-full">
          {t('allocation.optimize')}
        </Button>
      </aside>

      <div className="flex min-w-0 flex-col gap-6">
        <section className="air-surface-lg air-photo-art px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <span className="air-section-eyebrow">{t('allocation.title')}</span>
              <h1 className="text-[clamp(2rem,4vw,3.2rem)] leading-[0.96] font-bold tracking-[-0.05em] text-foreground">
                Strategic allocation, framed like a premium booking flow.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                {t('allocation.subtitle')}
              </p>
            </div>
            <Button variant="secondary" size="icon-sm">
              <Settings size={16} />
            </Button>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{t('allocation.sidebarAllocation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {items.map((asset) => {
              const color = statusColors[asset.assetType] || 'var(--foreground)'
              const badge = statusBadge[asset.status] || statusBadge['on-target']

              return (
                <div key={asset.assetType} className="space-y-4 rounded-[24px] bg-[var(--palette-surface-subtle)] px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="size-3 rounded-full" style={{ backgroundColor: color }} />
                      <div>
                        <p className="text-base font-semibold text-foreground">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.value.toLocaleString('vi-VN')} ₫</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {t('allocation.actual')} {asset.actualPercent}% / {t('allocation.target')} {asset.targetPercent}%
                      </span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  </div>

                  <div className="relative h-4 overflow-hidden rounded-full bg-white">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ width: `${asset.actualPercent}%`, backgroundColor: color }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-black/20"
                      style={{ left: `${asset.targetPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {!isGuest ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('allocation.setTarget')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {(['metal', 'crypto', 'stock'] as const).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label>{t(`common.${key}`)} (%)</Label>
                    <Input
                      value={targets[key]}
                      onChange={(e) => setTargets((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 rounded-[20px] bg-[var(--palette-surface-subtle)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={15} />
                  {t('allocation.totalAllocation')}: {total}% {total === 100 ? `(${t('allocation.valid')})` : `(${t('allocation.invalid')})`}
                </div>
                <Button onClick={handleSave} disabled={setTargetsMut.isPending || total !== 100}>
                  {setTargetsMut.isPending ? '...' : t('allocation.saveChanges')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Alert>
          <Info size={18} className="text-[var(--palette-bg-primary-core)]" />
          <AlertTitle>{t('allocation.recommendationTitle')}</AlertTitle>
          <AlertDescription>
            {recommendation?.summary || t('allocation.recommendationDesc')}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
