import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { allocationApi } from '@/lib/api'
import { toast } from 'sonner'
import type { AllocationCurrent, AllocationTarget, AllocationRecommendation } from '@/types/api'

export function useCurrentAllocation() {
  return useQuery<AllocationCurrent[]>({
    queryKey: ['allocation', 'current'],
    queryFn: allocationApi.getCurrentAllocation,
  })
}

export function useAllocationRecommendation() {
  return useQuery<AllocationRecommendation>({
    queryKey: ['allocation', 'recommendation'],
    queryFn: allocationApi.getRecommendation,
  })
}

export function useSetAllocationTargets() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (targets: AllocationTarget[]) => allocationApi.setTargets(targets),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allocation'] })
      toast.success('Đã lưu mục tiêu phân bổ')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Lưu mục tiêu thất bại')
    },
  })
}
