import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, PieChart, RefreshCw, Clock, BarChart3, Settings, CheckCircle2, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
  const statusStyles: Record<string, string> = {
    overweight: 'bg-gold/10 border-gold/20 text-gold',
    underweight: 'bg-[rgba(127,41,39,0.2)] border-negative/20 text-negative',
    'on-target': 'bg-label/10 border-label/20 text-label',
  }
  const statusLabel: Record<string, string> = { overweight: t('allocation.overweight'), underweight: t('allocation.underweight'), 'on-target': t('allocation.balanced') }

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
      <aside className="flex w-64 flex-col gap-2 border-r border-edge bg-page px-4 py-4">
        <div className="mb-6 px-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-dim">{t('allocation.sidebarMenu')}</span>
          <p className="text-[13px] text-caption">{t('allocation.premium')}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {sidebarLinks.map((link) => (
            <button key={link.label} className={`flex w-full cursor-pointer items-center gap-3 rounded bg-transparent px-3 py-2.5 text-[13px] transition-colors ${link.active ? 'bg-panel-alt font-semibold text-heading' : 'text-dim hover:text-caption'}`}>
              <link.icon size={14} />{link.label}
            </button>
          ))}
        </nav>
        <button className="w-full cursor-pointer rounded border border-edge bg-field py-2.5 text-[13px] font-medium text-label transition-colors hover:brightness-110">{t('allocation.optimize')}</button>
      </aside>

      <main className="flex-1 px-16 py-8">
        <div className="flex max-w-[896px] flex-col gap-8">
          <div className="flex items-end justify-between border-b border-edge-subtle pb-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-body">{t('allocation.title')}</h1>
              <p className="text-base text-caption">{t('allocation.subtitle')}</p>
            </div>
            <button className="cursor-pointer bg-transparent text-caption transition-colors hover:text-body"><Settings size={22} /></button>
          </div>

          <div className="flex flex-col gap-12 rounded-lg border border-[rgba(71,71,78,0.05)] bg-panel p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
            {items.map((asset) => {
              const color = statusColors[asset.assetType] || 'var(--btn)'
              return (
                <div key={asset.assetType} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-2 rounded-xl" style={{ backgroundColor: color }} />
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-body">{asset.name}</span>
                        <span className="font-['JetBrains_Mono'] text-sm tracking-[-0.28px] text-caption">{asset.value.toLocaleString('vi-VN')} ₫</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-body">{t('allocation.actual')} {asset.actualPercent}%</span>
                        <span className="text-dim">/</span>
                        <span className="text-caption">{t('allocation.target')} {asset.targetPercent}%</span>
                      </div>
                      <span className={`rounded-xl border px-3 py-1 text-xs font-medium ${statusStyles[asset.status] || ''}`}>{statusLabel[asset.status] || asset.status}</span>
                    </div>
                  </div>
                  <div className="relative h-4">
                    <div className="absolute inset-0 overflow-hidden rounded-xl bg-field"><div className="h-full opacity-30" style={{ width: `${asset.targetPercent}%`, background: 'linear-gradient(to right, var(--dim) 50%, transparent 50%)' }} /></div>
                    <div className="absolute inset-y-0 left-0 rounded-xl" style={{ width: `${asset.actualPercent}%`, backgroundColor: color, boxShadow: `0 0 15px 0 ${color}4D` }} />
                    <div className="absolute -top-1 h-6 w-0.5 bg-dim" style={{ left: `${asset.targetPercent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-6">
            <div className="flex items-center gap-2"><Settings size={17} className="text-caption" /><h2 className="text-sm font-bold uppercase tracking-[1.4px] text-body">{t('allocation.setTarget')}</h2></div>
            <div className="grid grid-cols-3 gap-6">
              {(['metal', 'crypto', 'stock'] as const).map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-dim">{t(`common.${key}`)} (%)</label>
                  <Input value={targets[key]} onChange={(e) => setTargets((p) => ({ ...p, [key]: e.target.value }))} className="h-12 rounded border-none bg-field px-4 font-['JetBrains_Mono'] text-base tracking-[-0.32px] text-body" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-edge-subtle pt-6">
              <div className="flex items-center gap-2"><CheckCircle2 size={11} className="text-label" /><span className="text-[13px] text-label">{t('allocation.totalAllocation')}: {total}% {total === 100 ? `(${t('allocation.valid')})` : `(${t('allocation.invalid')})`}</span></div>
              <button onClick={handleSave} disabled={setTargetsMut.isPending || total !== 100} className="cursor-pointer rounded bg-btn px-8 py-2 text-sm font-bold text-on-btn transition-colors hover:bg-btn-hover disabled:opacity-50">
                {setTargetsMut.isPending ? '...' : t('allocation.saveChanges')}
              </button>
            </div>
          </div>

          <div className="flex gap-5 rounded-lg border-l-4 border-gold bg-field/40 px-7 py-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15"><Info size={20} className="text-gold" /></div>
            <div className="flex flex-col gap-1">
              <h4 className="text-base font-bold text-body">{t('allocation.recommendationTitle')}</h4>
              <p className="text-base leading-[26px] text-caption">{recommendation?.summary || t('allocation.recommendationDesc')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
