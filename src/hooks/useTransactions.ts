import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '@/lib/api'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import type { TransactionFilters, CreateTransactionRequest, UpdateTransactionRequest, Transaction, Paginated } from '@/types/api'

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
      toast.success('Giao dịch đã được tạo')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Tạo giao dịch thất bại')
    },
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionRequest }) => transactionsApi.updateTransaction(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Đã cập nhật giao dịch')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Cập nhật giao dịch thất bại')
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
      toast.success('Đã xóa giao dịch')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Xóa giao dịch thất bại')
    },
  })
}

export function useBulkDeleteTransactions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => transactionsApi.bulkDeleteTransactions(ids),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      toast.success(`Đã xóa ${data.deleted} giao dịch`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Xóa giao dịch thất bại')
    },
  })
}

export function useImportCSV() {
  const qc = useQueryClient()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: (file: File) => transactionsApi.importCSV(file),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
      if (data.errorCount > 0) {
        toast.warning(t('transactions.csvPartial', { success: data.successCount, error: data.errorCount }))
      } else {
        toast.success(t('transactions.csvSuccess', { count: data.successCount }))
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t('transactions.csvError'))
    },
  })
}
