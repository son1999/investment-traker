import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assetsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { AssetDetail, AssetTransaction, Paginated, Period, AssetType, CreateAssetRequest, UpdateAssetRequest, Asset } from '@/types/api'

export function useAssets(type?: AssetType) {
  return useQuery<Asset[]>({
    queryKey: ['assets', 'list', type],
    queryFn: () => assetsApi.getAssets(type),
  })
}

export function useCreateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAssetRequest) => assetsApi.createAsset(data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['assets'] })
      toast.success(`Đã tạo tài sản ${data.code}`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Tạo tài sản thất bại')
    },
  })
}

export function useUpdateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: UpdateAssetRequest }) => assetsApi.updateAsset(code, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assets'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      toast.success('Đã cập nhật tài sản')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Cập nhật tài sản thất bại')
    },
  })
}

export function useDeleteAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => assetsApi.deleteAsset(code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assets'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      toast.success('Đã xóa tài sản')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Xóa tài sản thất bại')
    },
  })
}

export function useAssetDetail(code: string) {
  return useQuery<AssetDetail>({
    queryKey: ['assets', code, 'detail'],
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
