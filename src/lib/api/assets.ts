import client from './client'
import type { Asset, CreateAssetRequest, UpdateAssetRequest, AssetDetail, AssetTransaction, AssetTransactionFilters, Paginated, AssetType } from '@/types/api'

export async function getAssets(type?: AssetType): Promise<Asset[]> {
  const params = type ? { type } : {}
  const res = await client.get<{ data: Asset[] }>('/api/assets', { params })
  return res.data.data
}

export async function createAsset(data: CreateAssetRequest): Promise<Asset> {
  const res = await client.post<{ data: Asset }>('/api/assets', data)
  return res.data.data
}

export async function updateAsset(code: string, data: UpdateAssetRequest): Promise<Asset> {
  const res = await client.patch<{ data: Asset }>(`/api/assets/${code}`, data)
  return res.data.data
}

export async function deleteAsset(code: string): Promise<void> {
  await client.delete(`/api/assets/${code}`)
}

export async function getAssetDetail(code: string): Promise<AssetDetail> {
  const res = await client.get<{ data: AssetDetail }>(`/api/assets/${code}/detail`)
  return res.data.data
}

export async function getAssetTransactions(
  code: string,
  params: AssetTransactionFilters = {},
): Promise<Paginated<AssetTransaction>> {
  const res = await client.get<Paginated<AssetTransaction>>(`/api/assets/${code}/transactions`, { params })
  return res.data
}
