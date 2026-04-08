import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pricesApi } from '@/lib/api'
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prices'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}

export function useUpdatePriceByCode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ code, price }: { code: string; price: number }) =>
      pricesApi.updatePriceByCode(code, price),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prices'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}
