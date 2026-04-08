import client from './client'
import type { Currency, CreateCurrencyRequest, UpdateCurrencyRequest } from '@/types/api'

export async function getCurrencies(): Promise<Currency[]> {
  const res = await client.get<{ data: Currency[] }>('/api/currencies')
  return res.data.data
}

export async function createCurrency(data: CreateCurrencyRequest): Promise<Currency> {
  const res = await client.post<{ data: Currency }>('/api/currencies', data)
  return res.data.data
}

export async function updateCurrency(code: string, data: UpdateCurrencyRequest): Promise<Currency> {
  const res = await client.patch<{ data: Currency }>(`/api/currencies/${code}`, data)
  return res.data.data
}

export async function deleteCurrency(code: string): Promise<void> {
  await client.delete(`/api/currencies/${code}`)
}
