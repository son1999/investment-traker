import { create } from 'zustand'
import { toast } from 'sonner'

interface ConnectionState {
  projectUrl: string
  anonKey: string
  isConnecting: boolean
  setProjectUrl: (url: string) => void
  setAnonKey: (key: string) => void
  connect: () => Promise<void>
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  projectUrl: localStorage.getItem('itracker-project-url') || '',
  anonKey: localStorage.getItem('itracker-anon-key') || '',
  isConnecting: false,
  setProjectUrl: (url) => set({ projectUrl: url }),
  setAnonKey: (key) => set({ anonKey: key }),
  connect: async () => {
    const { projectUrl, anonKey } = get()
    if (!projectUrl.trim() || !anonKey.trim()) {
      toast.error('Thiếu thông tin kết nối')
      return
    }
    set({ isConnecting: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem('itracker-project-url', projectUrl.trim())
      localStorage.setItem('itracker-anon-key', anonKey.trim())
      toast.success('Đã lưu cấu hình kết nối')
    } finally {
      set({ isConnecting: false })
    }
  },
}))
