import client from './client'
import type { LoginRequest, LoginResponse } from '@/types/api'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await client.post<LoginResponse>('/api/auth/login', data)
  return res.data
}

export async function logout(): Promise<void> {
  await client.post('/api/auth/logout')
}
