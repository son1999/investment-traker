import { NavLink, useNavigate } from 'react-router-dom'
import { Sun, Moon, Languages, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore, type Theme } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
const logoUrl = '/logo.png'

const navKeys = [
  { key: 'nav.dashboard', to: '/dashboard' },
  { key: 'nav.transactions', to: '/transactions' },
  { key: 'nav.reports', to: '/reports' },
  { key: 'nav.prices', to: '/prices' },
  { key: 'nav.assets', to: '/assets' },
  { key: 'nav.currencies', to: '/currencies' },
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

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')
  }

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
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="gap-1 text-caption hover:text-heading"
          >
            <Languages size={14} />
            <span className="text-[11px] font-medium uppercase">{i18n.language}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="ml-1 rounded-full" />
              }
            >
              <Avatar size="sm">
                <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{user?.email || 'User'}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* Theme toggle */}
              <div className="flex rounded-lg bg-muted p-0.5 mx-1 mb-1">
                {themes.map((thm) => {
                  const ThemeIcon = thm.icon
                  const active = theme === thm.value
                  return (
                    <button
                      key={thm.value}
                      onClick={() => setTheme(thm.value)}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-medium transition-all ${
                        active
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <ThemeIcon size={13} />
                      {thm.label}
                    </button>
                  )
                })}
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={async () => {
                  await logout()
                  navigate('/login')
                }}
              >
                <LogOut size={13} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
