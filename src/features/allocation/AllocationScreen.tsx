import { useState } from 'react'
import {
  LayoutGrid,
  PieChart,
  RefreshCw,
  Clock,
  BarChart3,
  Settings,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

const sidebarLinks = [
  { icon: LayoutGrid, label: 'Tổng quan', active: false },
  { icon: PieChart, label: 'Phân bổ', active: true },
  { icon: RefreshCw, label: 'Tái cân bằng', active: false },
  { icon: Clock, label: 'Lịch sử', active: false },
  { icon: BarChart3, label: 'Phân tích', active: false },
]

const assets = [
  {
    name: 'Vàng',
    value: '450.000.000 ₫',
    actual: 32,
    target: 30,
    color: '#ffb148',
    status: 'Thừa 2%',
    statusType: 'over' as const,
  },
  {
    name: 'Bitcoin',
    value: '280.000.000 ₫',
    actual: 17,
    target: 25,
    color: '#f7931a',
    status: 'Thiếu 8%',
    statusType: 'under' as const,
  },
  {
    name: 'Cổ phiếu',
    value: '700.000.000 ₫',
    actual: 51,
    target: 45,
    color: 'var(--btn)',
    status: 'Cân bằng',
    statusType: 'balanced' as const,
  },
]

const statusStyles = {
  over: 'bg-gold/10 border-gold/20 text-gold',
  under: 'bg-[rgba(127,41,39,0.2)] border-negative/20 text-negative',
  balanced: 'bg-label/10 border-label/20 text-label',
}

export default function AllocationScreen() {
  const [targets, setTargets] = useState({ gold: '30', bitcoin: '25', stock: '45' })
  const total =
    (parseInt(targets.gold) || 0) +
    (parseInt(targets.bitcoin) || 0) +
    (parseInt(targets.stock) || 0)

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col gap-2 border-r border-edge bg-page px-4 py-4">
        <div className="mb-6 px-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-dim">
            Danh mục chính
          </span>
          <p className="text-[13px] text-caption">Premium Tier</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.label}
              className={`flex w-full cursor-pointer items-center gap-3 rounded bg-transparent px-3 py-2.5 text-[13px] transition-colors ${
                link.active
                  ? 'bg-panel-alt font-semibold text-heading'
                  : 'text-dim hover:text-caption'
              }`}
            >
              <link.icon size={14} />
              {link.label}
            </button>
          ))}
        </nav>

        <button className="w-full cursor-pointer rounded border border-edge bg-field py-2.5 text-[13px] font-medium text-label transition-colors hover:brightness-110">
          Tối ưu hóa
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-16 py-8">
        <div className="flex max-w-[896px] flex-col gap-8">
          {/* Header */}
          <div className="flex items-end justify-between border-b border-edge-subtle pb-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-body">
                Mục tiêu phân bổ
              </h1>
              <p className="text-base text-caption">
                So sánh phân bổ thực tế vs mục tiêu chiến lược của bạn
              </p>
            </div>
            <button className="cursor-pointer bg-transparent text-caption transition-colors hover:text-body">
              <Settings size={22} />
            </button>
          </div>

          {/* Allocation comparison card */}
          <div className="flex flex-col gap-12 rounded-lg border border-[rgba(71,71,78,0.05)] bg-panel p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
            {assets.map((asset) => (
              <div key={asset.name} className="flex flex-col gap-4">
                {/* Info row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-2 rounded-xl"
                      style={{ backgroundColor: asset.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-body">{asset.name}</span>
                      <span className="font-['JetBrains_Mono'] text-sm tracking-[-0.28px] text-caption">
                        {asset.value}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-body">Thực tế {asset.actual}%</span>
                      <span className="text-dim">/</span>
                      <span className="text-caption">Mục tiêu {asset.target}%</span>
                    </div>
                    <span
                      className={`rounded-xl border px-3 py-1 text-xs font-medium ${statusStyles[asset.statusType]}`}
                    >
                      {asset.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-4">
                  {/* Track */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl bg-field">
                    <div
                      className="h-full opacity-30"
                      style={{
                        width: `${asset.target}%`,
                        background: `linear-gradient(to right, var(--dim) 50%, transparent 50%)`,
                      }}
                    />
                  </div>
                  {/* Actual bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-xl"
                    style={{
                      width: `${asset.actual}%`,
                      backgroundColor: asset.color,
                      boxShadow: `0 0 15px 0 ${asset.color}4D`,
                    }}
                  />
                  {/* Target pin */}
                  <div
                    className="absolute -top-1 h-6 w-0.5 bg-dim"
                    style={{ left: `${asset.target}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Settings form */}
          <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-6">
            <div className="flex items-center gap-2">
              <Settings size={17} className="text-caption" />
              <h2 className="text-sm font-bold uppercase tracking-[1.4px] text-body">
                Cài đặt tỷ trọng mục tiêu
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-dim">
                  Vàng (%)
                </label>
                <Input
                  value={targets.gold}
                  onChange={(e) => setTargets((p) => ({ ...p, gold: e.target.value }))}
                  className="h-12 rounded border-none bg-field px-4 font-['JetBrains_Mono'] text-base tracking-[-0.32px] text-body"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-dim">
                  Bitcoin (%)
                </label>
                <Input
                  value={targets.bitcoin}
                  onChange={(e) => setTargets((p) => ({ ...p, bitcoin: e.target.value }))}
                  className="h-12 rounded border-none bg-field px-4 font-['JetBrains_Mono'] text-base tracking-[-0.32px] text-body"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-dim">
                  Cổ phiếu (%)
                </label>
                <Input
                  value={targets.stock}
                  onChange={(e) => setTargets((p) => ({ ...p, stock: e.target.value }))}
                  className="h-12 rounded border-none bg-field px-4 font-['JetBrains_Mono'] text-base tracking-[-0.32px] text-body"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-edge-subtle pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={11} className="text-label" />
                <span className="text-[13px] text-label">
                  Tổng phân bổ: {total}% {total === 100 ? '(Hợp lệ)' : '(Chưa hợp lệ)'}
                </span>
              </div>
              <button className="cursor-pointer rounded bg-btn px-8 py-2 text-sm font-bold text-on-btn transition-colors hover:bg-btn-hover">
                Lưu thay đổi
              </button>
            </div>
          </div>

          {/* Recommendation card */}
          <div className="flex gap-5 rounded-lg border-l-4 border-gold bg-field/40 px-7 py-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/15">
              <Info size={20} className="text-gold" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-base font-bold text-body">Gợi ý tái cân bằng</h4>
              <p className="text-base leading-[26px] text-caption">
                Danh mục đang lệch khỏi mục tiêu chiến lược. Chúng tôi khuyên bạn nên{' '}
                <span className="font-semibold text-body underline decoration-[rgba(255,177,72,0.4)]">
                  bán ~15 tr ₫ Vàng
                </span>{' '}
                và{' '}
                <span className="font-semibold text-body underline decoration-[rgba(198,198,199,0.4)]">
                  mua thêm ~15 tr ₫ Cổ phiếu
                </span>{' '}
                để đạt được hiệu quả phân bổ tối ưu.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
