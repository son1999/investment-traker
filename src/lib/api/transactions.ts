import client from './client'
import type {
  Transaction,
  CreateTransactionRequest,
  TransactionFilters,
  Paginated,
} from '@/types/api'

export async function getTransactions(filters: TransactionFilters = {}): Promise<Paginated<Transaction>> {
  const res = await client.get<Paginated<Transaction>>('/api/transactions', { params: filters })
  return res.data
}

export async function getRecentTransactions(limit = 4): Promise<Transaction[]> {
  const res = await client.get<Transaction[]>('/api/transactions/recent', { params: { limit } })
  return res.data
}

export async function createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
  const res = await client.post<Transaction>('/api/transactions', data)
  return res.data
}

export async function deleteTransaction(id: string): Promise<void> {
  await client.delete(`/api/transactions/${id}`)
}

export async function bulkDeleteTransactions(ids: string[]): Promise<{ deleted: number }> {
  const res = await client.post<{ deleted: number }>('/api/transactions/bulk-delete', { ids })
  return res.data
}
