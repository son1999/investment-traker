import { create } from 'zustand'

interface TransactionsUIState {
  filter: string
  search: string
  page: number
  showForm: boolean
  selectedIds: string[]
  setFilter: (filter: string) => void
  setSearch: (search: string) => void
  setPage: (page: number) => void
  setShowForm: (show: boolean) => void
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  deselectAll: () => void
  clearSelection: () => void
}

export const useTransactionsUIStore = create<TransactionsUIState>((set) => ({
  filter: '',
  search: '',
  page: 1,
  showForm: false,
  selectedIds: [],

  setFilter: (filter) => set({ filter, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setShowForm: (showForm) => set({ showForm }),
  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((sid) => sid !== id)
        : [...s.selectedIds, id],
    })),
  selectAll: (ids) => set({ selectedIds: ids }),
  deselectAll: () => set({ selectedIds: [] }),
  clearSelection: () => set({ selectedIds: [] }),
}))
