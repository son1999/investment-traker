import { useQuery } from '@tanstack/react-query'
import { assetsApi } from '@/lib/api'
import type { AssetDetail, AssetTransaction, Paginated, Period } from '@/types/api'

export function useAssetDetail(code: string) {
  return useQuery<AssetDetail>({
    queryKey: ['assets', code],
    queryFn: () => assetsApi.getAssetDetail(code),
    enabled: !!code,
  })
}

export function useAssetTransactions(
  code: string,
  params: { period?: Period; page?: number; limit?: number } = {},
) {
  return useQuery<Paginated<AssetTransaction>>({
    queryKey: ['assets', code, 'transactions', params],
    queryFn: () => assetsApi.getAssetTransactions(code, params),
    enabled: !!code,
  })
}
