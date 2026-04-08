import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Sun, Moon, Languages, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore, type Theme } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
const logoUrl = '/logo.png'

const navKeys = [
  { key: 'nav.dashboard', to: '/dashboard' },
  { key: 'nav.transactions', to: '/transactions' },
  { key: 'nav.reports', to: '/reports' },
  { key: 'nav.prices', to: '/prices' },
]

const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
]

export default function AppHeader() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useThemeStore()
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-edge bg-page">
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-6">
        <NavLink to="/dashboard" className="flex items-center">
          <img src={logoUrl} alt="Logo" className="h-14 w-auto" />
        </NavLink>

        <nav className="flex items-center gap-1">
          {navKeys.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                  isActive
                    ? 'font-medium text-heading bg-edge-subtle'
                    : 'text-label hover:text-heading hover:bg-edge-subtle'
                }`
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleLang}
            className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-caption transition-colors hover:bg-edge-subtle hover:text-heading"
          >
            <Languages size={14} />
            <span className="text-[11px] font-medium uppercase">{i18n.language}</span>
          </button>

          {/* User avatar + dropdown */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-edge bg-panel transition-colors hover:border-edge-strong"
            >
              <span className="text-[11px] font-medium text-caption">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
            </button>

            {open && (
              <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-edge bg-panel p-1.5 shadow-xl">
                {/* Theme toggle */}
                <div className="mb-1 flex rounded-lg bg-field p-0.5">
                  {themes.map((thm) => {
                    const ThemeIcon = thm.icon
                    const active = theme === thm.value
                    return (
                      <button
                        key={thm.value}
                        onClick={() => setTheme(thm.value)}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-medium transition-all ${
                          active
                            ? 'bg-panel text-heading shadow-sm'
                            : 'text-caption hover:text-body'
                        }`}
                      >
                        <ThemeIcon size={13} />
                        {thm.label}
                      </button>
                    )
                  })}
                </div>

                {/* Logout */}
                <button
                  onClick={async () => {
                    setOpen(false)
                    await logout()
                    navigate('/login')
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-negative transition-colors hover:bg-negative/8"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
