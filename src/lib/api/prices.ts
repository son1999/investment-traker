import client from './client'
import type { PriceEntry, CreatePriceRequest, AssetType } from '@/types/api'

export async function getPrices(type?: AssetType): Promise<PriceEntry[]> {
  const params = type ? { type } : {}
  const res = await client.get<PriceEntry[]>('/api/prices', { params })
  return res.data
}

export async function createOrUpdatePrice(data: CreatePriceRequest): Promise<PriceEntry> {
  const res = await client.post<PriceEntry>('/api/prices', data)
  return res.data
}

export async function updatePriceByCode(code: string, price: number): Promise<PriceEntry> {
  const res = await client.patch<PriceEntry>(`/api/prices/${code}`, { price })
  return res.data
}
