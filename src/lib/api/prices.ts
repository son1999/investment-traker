import client from './client'
import type { PriceEntry, CreatePriceRequest, AssetType } from '@/types/api'

export async function getPrices(type?: AssetType): Promise<PriceEntry[]> {
  const params = type ? { type } : {}
  const res = await client.get<{ data: PriceEntry[] }>('/api/prices', { params })
  return res.data.data
}

export async function createOrUpdatePrice(data: CreatePriceRequest): Promise<PriceEntry> {
  const res = await client.post<{ data: PriceEntry }>('/api/prices', data)
  return res.data.data
}

export async function updatePriceByCode(code: string, price: number): Promise<PriceEntry> {
  const res = await client.patch<{ data: PriceEntry }>(`/api/prices/${code}`, { price })
  return res.data.data
}
