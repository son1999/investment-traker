import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pricesApi } from '@/lib/api'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import type { AssetType, CreatePriceRequest, PriceEntry, LivePriceResult } from '@/types/api'

export function usePrices(type?: AssetType) {
  return useQuery<PriceEntry[]>({
    queryKey: ['prices', type],
    queryFn: () => pricesApi.getPrices(type),
  })
}

export function useCreateOrUpdatePrice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePriceRequest) => pricesApi.createOrUpdatePrice(data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['prices'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      toast.success(`Đã cập nhật giá ${data.code}`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Cập nhật giá thất bại')
    },
  })
}

export function useUpdatePriceByCode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ code, price }: { code: string; price: number }) =>
      pricesApi.updatePriceByCode(code, price),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['prices'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      toast.success(`Đã cập nhật giá ${data.code}`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Cập nhật giá thất bại')
    },
  })
}

export function useRefreshAllPrices() {
  const qc = useQueryClient()
  const { t } = useTranslation()
  return useMutation({
    mutationFn: () => pricesApi.refreshAllPrices(),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['prices'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      toast.success(t('prices.refreshSuccess', { count: data.count }))
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || t('prices.refreshError'))
    },
  })
}

export function useLivePrice(code: string, type: 'crypto' | 'stock' | 'metal') {
  return useQuery<LivePriceResult>({
    queryKey: ['prices', 'live', code, type],
    queryFn: () => pricesApi.getLivePrice(code, type),
    enabled: !!code && (type === 'crypto' || type === 'stock' || type === 'metal'),
    staleTime: 5 * 60 * 1000,
  })
}
