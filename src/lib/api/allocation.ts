import client from './client'
import type {
  AllocationCurrent,
  AllocationTarget,
  AllocationRecommendation,
} from '@/types/api'

export async function getCurrentAllocation(): Promise<AllocationCurrent[]> {
  const res = await client.get<AllocationCurrent[]>('/api/allocation/current')
  return res.data
}

export async function setTargets(targets: AllocationTarget[]): Promise<{ success: boolean; total: number }> {
  const res = await client.post<{ success: boolean; total: number }>('/api/allocation/targets', { targets })
  return res.data
}

export async function getRecommendation(): Promise<AllocationRecommendation> {
  const res = await client.get<AllocationRecommendation>('/api/allocation/recommendation')
  return res.data
}
