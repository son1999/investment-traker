import { create } from 'zustand'
import { authApi } from '@/lib/api'
import { getErrorMessage } from '@/lib/api/error'
import { toast } from 'sonner'
import type { User } from '@/types/api'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('itracker-token'),
  user: JSON.parse(localStorage.getItem('itracker-user') || 'null'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authApi.login({ email, password })
      localStorage.setItem('itracker-token', data.accessToken)
      localStorage.setItem('itracker-refresh-token', data.refreshToken)
      localStorage.setItem('itracker-user', JSON.stringify(data.user))
      set({ token: data.accessToken, user: data.user, isLoading: false })
      toast.success('Đăng nhập thành công!')
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Login failed')
      set({ error: message, isLoading: false })
      toast.error(message)
      throw error
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('itracker-token')
      localStorage.removeItem('itracker-refresh-token')
      localStorage.removeItem('itracker-user')
      set({ token: null, user: null })
    }
  },

  isAuthenticated: () => !!get().token,
}))
