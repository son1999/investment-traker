import { create } from 'zustand'

interface ConnectionState {
  projectUrl: string
  anonKey: string
  isConnecting: boolean
  setProjectUrl: (url: string) => void
  setAnonKey: (key: string) => void
  connect: () => Promise<void>
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  projectUrl: '',
  anonKey: '',
  isConnecting: false,
  setProjectUrl: (url) => set({ projectUrl: url }),
  setAnonKey: (key) => set({ anonKey: key }),
  connect: async () => {
    const { projectUrl, anonKey } = get()
    set({ isConnecting: true })
    try {
      // TODO: implement actual Supabase connection
      console.log('Connecting to Supabase...', { projectUrl, anonKey })
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      set({ isConnecting: false })
    }
  },
}))
