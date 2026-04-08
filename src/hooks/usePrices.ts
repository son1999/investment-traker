import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pricesApi } from '@/lib/api'
import { toast } from 'sonner'
import type { AssetType, CreatePriceRequest, PriceEntry } from '@/types/api'

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
