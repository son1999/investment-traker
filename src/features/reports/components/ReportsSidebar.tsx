import { LayoutGrid, Briefcase, TrendingUp, BarChart3, FileText, HelpCircle, LogOut } from 'lucide-react'

const navItems = [
  { icon: LayoutGrid, label: 'Overview', active: false },
  { icon: Briefcase, label: 'Portfolio', active: false },
  { icon: TrendingUp, label: 'DCA Strategy', active: true },
  { icon: BarChart3, label: 'Market', active: false },
  { icon: FileText, label: 'Reports', active: false },
]

const bottomItems = [
  { icon: HelpCircle, label: 'Support' },
  { icon: LogOut, label: 'Logout' },
]

export default function ReportsSidebar() {
  return (
    <aside className="flex flex-col gap-4 py-6">
      {/* Brand */}
      <div className="mb-8 px-2">
        <h2 className="text-lg font-bold text-heading">The Atelier</h2>
        <p className="font-serif text-[11px] uppercase tracking-[1.1px] text-caption">
          Premium Assets
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <div key={item.label} className={item.active ? 'px-2 py-1' : 'px-2'}>
            <button
              className={`flex w-full cursor-pointer items-center gap-3 rounded bg-transparent px-4 py-2.5 text-sm transition-colors ${
                item.active
                  ? 'bg-panel-alt text-heading shadow-sm'
                  : 'text-label hover:text-heading'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          </div>
        ))}
      </nav>

      {/* Add Transaction */}
      <div className="px-4 pt-8">
        <button className="w-full cursor-pointer rounded bg-btn py-3 text-sm font-bold text-on-btn transition-colors hover:bg-btn-hover">
          Add Transaction
        </button>
      </div>

      {/* Spacer + Bottom links */}
      <div className="mt-auto flex flex-col gap-1 border-t border-edge-subtle pt-4">
        {bottomItems.map((item) => (
          <div key={item.label} className="px-2">
            <button className="flex w-full cursor-pointer items-center gap-3 rounded bg-transparent px-4 py-2.5 text-sm text-label transition-colors hover:text-heading">
              <item.icon size={18} />
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </aside>
  )
}
