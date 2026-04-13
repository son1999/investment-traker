import { create } from 'zustand'
import type { Transaction } from '@/types/api'

interface TransactionsUIState {
  filter: string
  search: string
  page: number
  limit: number
  showForm: boolean
  editingTx: Transaction | null
  setFilter: (filter: string) => void
  setSearch: (search: string) => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setShowForm: (show: boolean) => void
  startEdit: (tx: Transaction) => void
  cancelEdit: () => void
}

export const useTransactionsUIStore = create<TransactionsUIState>((set) => ({
  filter: '',
  search: '',
  page: 1,
  limit: 20,
  showForm: false,
  editingTx: null,

  setFilter: (filter) => set({ filter, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setShowForm: (showForm) => set({ showForm, editingTx: showForm ? null : null }),
  startEdit: (tx) => set({ editingTx: tx, showForm: true }),
  cancelEdit: () => set({ editingTx: null, showForm: false }),
}))
