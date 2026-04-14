import client from './client'
import type { SavingsEvent, CreateSavingsEventRequest } from '@/types/api'

export async function getSavingsEvents(assetCode: string): Promise<SavingsEvent[]> {
  const res = await client.get<{ data: SavingsEvent[] }>('/api/savings-events', {
    params: { assetCode },
  })
  return res.data.data
}

export async function createSavingsEvent(data: CreateSavingsEventRequest): Promise<SavingsEvent> {
  const res = await client.post<{ data: SavingsEvent }>('/api/savings-events', data)
  return res.data.data
}

export async function deleteSavingsEvent(id: string): Promise<void> {
  await client.delete(`/api/savings-events/${id}`)
}
