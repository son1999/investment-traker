import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, PieChart, RefreshCw, Clock, BarChart3, Settings, CheckCircle2, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useCurrentAllocation, useAllocationRecommendation, useSetAllocationTargets } from '@/hooks/useAllocation'
import type { AssetType } from '@/types/api'

const statusColors: Record<string, string> = { metal: '#ffb148', crypto: '#f7931a', stock: 'var(--btn)' }

export default function AllocationScreen() {
  const { t } = useTranslation()
  const { data: allocations } = useCurrentAllocation()
  const { data: recommendation } = useAllocationRecommendation()
  const setTargetsMut = useSetAllocationTargets()

  const sidebarLinks = [
    { icon: LayoutGrid, label: t('allocation.sidebarOverview'), active: false },
    { icon: PieChart, label: t('allocation.sidebarAllocation'), active: true },
    { icon: RefreshCw, label: t('allocation.sidebarRebalance'), active: false },
    { icon: Clock, label: t('allocation.sidebarHistory'), active: false },
    { icon: BarChart3, label: t('allocation.sidebarAnalysis'), active: false },
  ]

  const items = allocations || []

  const statusBadge: Record<string, { variant: 'secondary' | 'destructive' | 'outline'; label: string }> = {
    overweight: { variant: 'secondary', label: t('allocation.overweight') },
    underweight: { variant: 'destructive', label: t('allocation.underweight') },
    'on-target': { variant: 'outline', label: t('allocation.balanced') },
  }

  const [targets, setTargets] = useState({ metal: '30', crypto: '25', stock: '45' })
  const total = (parseInt(targets.metal) || 0) + (parseInt(targets.crypto) || 0) + (parseInt(targets.stock) || 0)

  const handleSave = () => {
    if (total !== 100) return
    setTargetsMut.mutate([
      { assetType: 'metal' as AssetType, targetPercent: parseInt(targets.metal) || 0 },
      { assetType: 'crypto' as AssetType, targetPercent: parseInt(targets.crypto) || 0 },
      { assetType: 'stock' as AssetType, targetPercent: parseInt(targets.stock) || 0 },
    ])
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col gap-2 border-r border-edge bg-page px-4 py-4">
        <div className="mb-6 px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-dim">{t('allocation.sidebarMenu')}</span>
          <p className="text-[13px] text-caption">{t('allocation.premium')}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {sidebarLinks.map((link) => (
            <Button key={link.label} variant={link.active ? 'secondary' : 'ghost'} className="w-full justify-start gap-3 text-[13px]">
              <link.icon size={14} />{link.label}
            </Button>
          ))}
        </nav>
        <Button variant="outline" className="w-full">{t('allocation.optimize')}</Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-16 py-8">
        <div className="flex max-w-4xl flex-col gap-8">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-body">{t('allocation.title')}</h1>
              <p className="text-base text-caption">{t('allocation.subtitle')}</p>
            </div>
            <Button variant="ghost" size="icon"><Settings size={22} /></Button>
          </div>

          <Separator />

          {/* Allocation comparison */}
          <Card className="shadow-lg">
            <CardContent className="flex flex-col gap-12 p-8">
              {items.map((asset) => {
                const color = statusColors[asset.assetType] || 'var(--btn)'
                const badge = statusBadge[asset.status] || statusBadge['on-target']
                return (
                  <div key={asset.assetType} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-2 rounded-xl" style={{ backgroundColor: color }} />
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-body">{asset.name}</span>
                          <span className="font-['JetBrains_Mono'] text-sm text-caption">{asset.value.toLocaleString('vi-VN')} ₫</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span className="text-body">{t('allocation.actual')} {asset.actualPercent}%</span>
                          <span className="text-dim">/</span>
                          <span className="text-caption">{t('allocation.target')} {asset.targetPercent}%</span>
                        </div>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                    </div>
                    <div className="relative h-4">
                      <div className="absolute inset-0 overflow-hidden rounded-xl bg-muted">
                        <div className="h-full opacity-30" style={{ width: `${asset.targetPercent}%`, background: 'linear-gradient(to right, var(--dim) 50%, transparent 50%)' }} />
                      </div>
                      <div className="absolute inset-y-0 left-0 rounded-xl" style={{ width: `${asset.actualPercent}%`, backgroundColor: color, boxShadow: `0 0 15px 0 ${color}4D` }} />
                      <div className="absolute -top-1 h-6 w-0.5 bg-dim" style={{ left: `${asset.targetPercent}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Target form */}
          <Card className="border-edge">
            <CardHeader className="flex-row items-center gap-2">
              <Settings size={17} className="text-caption" />
              <CardTitle className="text-sm uppercase tracking-wider">{t('allocation.setTarget')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-6">
                {(['metal', 'crypto', 'stock'] as const).map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <Label className="text-[11px] uppercase tracking-wider text-dim">{t(`common.${key}`)} (%)</Label>
                    <Input value={targets[key]} onChange={(e) => setTargets((p) => ({ ...p, [key]: e.target.value }))} className="h-12 font-['JetBrains_Mono'] text-base" />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-muted-foreground" />
                  <span className="text-[13px] text-muted-foreground">
                    {t('allocation.totalAllocation')}: {total}% {total === 100 ? `(${t('allocation.valid')})` : `(${t('allocation.invalid')})`}
                  </span>
                </div>
                <Button onClick={handleSave} disabled={setTargetsMut.isPending || total !== 100}>
                  {setTargetsMut.isPending ? '...' : t('allocation.saveChanges')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Alert className="border-l-4 border-l-gold bg-muted/40">
            <Info className="text-gold" size={20} />
            <AlertTitle className="text-base font-bold">{t('allocation.recommendationTitle')}</AlertTitle>
            <AlertDescription className="text-base leading-relaxed">
              {recommendation?.summary || t('allocation.recommendationDesc')}
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  )
}
