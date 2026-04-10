import client from './client'
import type { LoginRequest, LoginResponse } from '@/types/api'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await client.post<{ data: LoginResponse }>('/api/auth/login', data)
  return res.data.data
}

export async function refresh(refreshToken: string): Promise<LoginResponse> {
  const res = await client.post<{ data: LoginResponse }>('/api/auth/refresh', { refreshToken })
  return res.data.data
}

export async function logout(): Promise<void> {
  await client.post('/api/auth/logout')
}
