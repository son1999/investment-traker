import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

function applyTheme(_theme: Theme) {
  void _theme
  document.documentElement.classList.toggle('dark', false)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light' as Theme,
      setTheme: (theme: Theme) => {
        applyTheme(theme)
        set({ theme: 'light' })
      },
    }),
    {
      name: 'itracker-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setTheme('light')
        } else {
          applyTheme('light')
        }
      },
    },
  ),
)
