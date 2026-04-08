import client from './client'
import type { AssetDetail, AssetTransaction, Paginated, Period } from '@/types/api'

export async function getAssetDetail(code: string): Promise<AssetDetail> {
  const res = await client.get<AssetDetail>(`/api/assets/${code}`)
  return res.data
}

export async function getAssetTransactions(
  code: string,
  params: { period?: Period; page?: number; limit?: number } = {},
): Promise<Paginated<AssetTransaction>> {
  const res = await client.get<Paginated<AssetTransaction>>(`/api/assets/${code}/transactions`, { params })
  return res.data
}
