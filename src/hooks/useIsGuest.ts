import { useAuthStore } from '@/stores/auth'

export function useIsGuest(): boolean {
  return useAuthStore((s) => s.user?.isGuest ?? false)
}
