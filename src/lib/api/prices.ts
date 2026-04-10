import client from './client'
import type { PriceEntry, CreatePriceRequest, AssetType, PriceRefreshResult, LivePriceResult } from '@/types/api'

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

export async function refreshAllPrices(): Promise<PriceRefreshResult> {
  const res = await client.post<{ data: PriceRefreshResult }>('/api/prices/refresh')
  return res.data.data
}

export async function getLivePrice(code: string, type: 'crypto' | 'stock' | 'metal'): Promise<LivePriceResult> {
  const res = await client.get<{ data: LivePriceResult }>(`/api/prices/${code}/live`, { params: { type } })
  return res.data.data
}
