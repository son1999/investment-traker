import { create } from 'zustand'

export interface Transaction {
  id: string
  date: string
  assetType: string
  assetCode: string
  action: 'MUA' | 'BÁN'
  quantity: number
  unitPrice: number
  note: string
  icon: string
  iconBg: string
}

interface TransactionsState {
  transactions: Transaction[]
  filter: string
  showForm: boolean
  selectedIds: string[]
  setFilter: (filter: string) => void
  setShowForm: (show: boolean) => void
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  removeTransaction: (id: string) => void
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  deselectAll: () => void
  removeSelected: () => void
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [
    {
      id: '1',
      date: '2025-01-15',
      assetType: 'Vàng',
      assetCode: 'SJC',
      action: 'MUA',
      quantity: 2,
      unitPrice: 82500000,
      note: 'Mua dịp Tết',
      icon: '🥇',
      iconBg: 'rgba(248,160,16,0.2)',
    },
    {
      id: '2',
      date: '2025-01-10',
      assetType: 'Bitcoin',
      assetCode: 'BTC',
      action: 'BÁN',
      quantity: 0.1,
      unitPrice: 1650000000,
      note: '',
      icon: '₿',
      iconBg: '#3b3b3e',
    },
    {
      id: '3',
      date: '2025-01-05',
      assetType: 'Cổ phiếu',
      assetCode: 'VNM',
      action: 'MUA',
      quantity: 1000,
      unitPrice: 68200,
      note: 'Tích lũy dài hạn',
      icon: '📈',
      iconBg: '#3b3b3e',
    },
  ],
  filter: 'Tất cả',
  showForm: true,
  selectedIds: [],
  setFilter: (filter) => set({ filter }),
  setShowForm: (showForm) => set({ showForm }),
  addTransaction: (data) =>
    set((s) => ({
      transactions: [{ ...data, id: Date.now().toString() }, ...s.transactions],
      showForm: false,
    })),
  removeTransaction: (id) =>
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
      selectedIds: s.selectedIds.filter((sid) => sid !== id),
    })),
  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((sid) => sid !== id)
        : [...s.selectedIds, id],
    })),
  selectAll: (ids) => set({ selectedIds: ids }),
  deselectAll: () => set({ selectedIds: [] }),
  removeSelected: () =>
    set((s) => ({
      transactions: s.transactions.filter((t) => !s.selectedIds.includes(t.id)),
      selectedIds: [],
    })),
}))
