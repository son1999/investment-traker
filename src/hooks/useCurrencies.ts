import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { currenciesApi } from '@/lib/api'
import type { Currency, CreateCurrencyRequest, UpdateCurrencyRequest } from '@/types/api'

export function useCurrencies() {
  return useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: currenciesApi.getCurrencies,
  })
}

export function useCreateCurrency() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCurrencyRequest) => currenciesApi.createCurrency(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currencies'] })
    },
  })
}

export function useUpdateCurrency() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: UpdateCurrencyRequest }) =>
      currenciesApi.updateCurrency(code, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currencies'] })
    },
  })
}

export function useDeleteCurrency() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => currenciesApi.deleteCurrency(code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currencies'] })
    },
  })
}
