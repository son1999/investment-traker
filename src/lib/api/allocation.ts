import client from './client'
import type {
  AllocationCurrent,
  AllocationTarget,
  AllocationRecommendation,
} from '@/types/api'

export async function getCurrentAllocation(): Promise<AllocationCurrent[]> {
  const res = await client.get<{ data: AllocationCurrent[] }>('/api/allocation/current')
  return res.data.data
}

export async function setTargets(targets: AllocationTarget[]): Promise<{ success: boolean; total: number }> {
  const res = await client.post<{ data: { success: boolean; total: number } }>('/api/allocation/targets', { targets })
  return res.data.data
}

export async function getRecommendation(): Promise<AllocationRecommendation> {
  const res = await client.get<{ data: AllocationRecommendation }>('/api/allocation/recommendation')
  return res.data.data
}
