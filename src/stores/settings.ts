import { create } from 'zustand'

interface AssetCategory {
  id: string
  icon: string
  name: string
  code: string
  color: string
}

interface SettingsState {
  showAmount: boolean
  compactNumbers: boolean
  currency: string
  weekStart: string
  categories: AssetCategory[]
  toggleShowAmount: () => void
  toggleCompactNumbers: () => void
  setCurrency: (v: string) => void
  setWeekStart: (v: string) => void
  addCategory: (cat: Omit<AssetCategory, 'id'>) => void
  removeCategory: (id: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  showAmount: true,
  compactNumbers: false,
  currency: 'VND',
  weekStart: 'mon',
  categories: [
    { id: '1', icon: '🏦', name: 'Tiền gửi ngân hàng', code: 'CASH', color: '#22c55e' },
    { id: '2', icon: '📈', name: 'Chứng khoán', code: 'STOCK', color: '#ffb148' },
  ],
  toggleShowAmount: () => set((s) => ({ showAmount: !s.showAmount })),
  toggleCompactNumbers: () => set((s) => ({ compactNumbers: !s.compactNumbers })),
  setCurrency: (currency) => set({ currency }),
  setWeekStart: (weekStart) => set({ weekStart }),
  addCategory: (cat) =>
    set((s) => ({
      categories: [...s.categories, { ...cat, id: Date.now().toString() }],
    })),
  removeCategory: (id) =>
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
}))
