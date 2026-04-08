import client from './client'
import type {
  Transaction,
  CreateTransactionRequest,
  TransactionFilters,
  Paginated,
} from '@/types/api'

export async function getTransactions(filters: TransactionFilters = {}): Promise<Paginated<Transaction>> {
  const res = await client.get<Paginated<Transaction>>('/api/transactions', { params: filters })
  // paginated responses are returned as-is (data + meta at top level)
  return res.data
}

export async function getRecentTransactions(limit = 4): Promise<Transaction[]> {
  const res = await client.get<{ data: Transaction[] }>('/api/transactions/recent', { params: { limit } })
  return res.data.data
}

export async function createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
  const res = await client.post<{ data: Transaction }>('/api/transactions', data)
  return res.data.data
}

export async function deleteTransaction(id: string): Promise<void> {
  await client.delete(`/api/transactions/${id}`)
}

export async function bulkDeleteTransactions(ids: string[]): Promise<{ deleted: number }> {
  const res = await client.post<{ data: { deleted: number } }>('/api/transactions/bulk-delete', { ids })
  return res.data.data
}
