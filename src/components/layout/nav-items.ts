import type { LucideIcon } from 'lucide-react'
import {
  ArrowUpDown,
  ChartColumnBig,
  Coins,
  Landmark,
  LayoutGrid,
  WalletCards,
} from 'lucide-react'

export interface HeaderNavItem {
  key: string
  to: string
  icon: LucideIcon
}

export const headerNavItems: HeaderNavItem[] = [
  { key: 'nav.dashboard', to: '/dashboard', icon: LayoutGrid },
  { key: 'nav.transactions', to: '/transactions', icon: ArrowUpDown },
  { key: 'nav.reports', to: '/reports', icon: ChartColumnBig },
  { key: 'nav.prices', to: '/prices', icon: Coins },
  { key: 'nav.assets', to: '/assets', icon: WalletCards },
  { key: 'nav.currencies', to: '/currencies', icon: Landmark },
]
