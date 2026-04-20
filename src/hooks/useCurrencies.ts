import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { currenciesApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/api/error'
import { toast } from 'sonner'
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
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['currencies'] })
      toast.success(`Đã tạo tiền tệ ${data.code}`)
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Tạo tiền tệ thất bại'))
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
      toast.success('Đã cập nhật tiền tệ')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Cập nhật tiền tệ thất bại'))
    },
  })
}

export function useDeleteCurrency() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => currenciesApi.deleteCurrency(code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currencies'] })
      toast.success('Đã xóa tiền tệ')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Xóa tiền tệ thất bại'))
    },
  })
}
