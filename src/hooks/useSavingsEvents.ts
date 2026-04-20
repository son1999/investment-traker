import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { savingsEventsApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/api/error'
import type { CreateSavingsEventRequest, SavingsEvent } from '@/types/api'

export function useSavingsEvents(assetCode: string | undefined) {
  return useQuery<SavingsEvent[]>({
    queryKey: ['savings-events', assetCode],
    queryFn: () => savingsEventsApi.getSavingsEvents(assetCode as string),
    enabled: !!assetCode,
  })
}

export function useCreateSavingsEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSavingsEventRequest) => savingsEventsApi.createSavingsEvent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings-events'] })
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
      qc.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Đã ghi nhận giao dịch tiết kiệm')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Ghi nhận thất bại'))
    },
  })
}

export function useDeleteSavingsEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => savingsEventsApi.deleteSavingsEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings-events'] })
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['portfolio'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
      qc.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Đã xóa giao dịch tiết kiệm')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Xóa thất bại'))
    },
  })
}
