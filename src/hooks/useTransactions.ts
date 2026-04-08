import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '@/lib/api'
import type { TransactionFilters, CreateTransactionRequest, Transaction, Paginated } from '@/types/api'

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery<Paginated<Transaction>>({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.getTransactions(filters),
  })
}

export function useRecentTransactions(limit = 4) {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', 'recent', limit],
    queryFn: () => transactionsApi.getRecentTransactions(limit),
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionsApi.createTransaction(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transactionsApi.deleteTransaction(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}

export function useBulkDeleteTransactions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => transactionsApi.bulkDeleteTransactions(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}
