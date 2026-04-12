import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, Languages, LogOut, Menu, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore, type Theme } from '@/stores/theme'

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
  const location = useLocation()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')
  }

  const isLinkActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`)

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 min-w-0 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <NavLink to="/dashboard" className="flex min-w-0 items-center">
          <img src={logoUrl} alt="Logo" className="h-9 w-auto sm:h-10" />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navKeys.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex min-w-0 items-center gap-0.5 sm:gap-1">
          <Dialog>
            <DialogTrigger
              render={<Button variant="ghost" size="icon-sm" className="rounded-2xl md:hidden" />}
            >
              <Menu size={18} />
            </DialogTrigger>

            <DialogContent
              showCloseButton
              className="left-auto right-4 top-16 w-[calc(100%-2rem)] max-w-xs translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-3xl p-0 sm:right-6 md:hidden"
            >
              <DialogHeader className="border-b px-5 py-4 pr-12">
                <DialogTitle className="text-lg font-semibold">{t('app.brand')}</DialogTitle>
                <p className="text-xs text-muted-foreground">{user?.email || 'User'}</p>
              </DialogHeader>

              <div className="grid gap-1 p-2">
                {navKeys.map((link) => (
                  <DialogClose
                    key={link.to}
                    render={
                      <Button
                        variant="ghost"
                        className={cn(
                          'h-auto w-full justify-between rounded-2xl px-4 py-3 text-left text-base font-medium',
                          isLinkActive(link.to)
                            ? 'bg-secondary text-secondary-foreground'
                            : 'text-foreground hover:bg-muted',
                        )}
                      />
                    }
                    onClick={() => navigate(link.to)}
                  >
                    <span>{t(link.key)}</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </DialogClose>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="gap-1 px-2 min-[380px]:px-2.5 sm:px-3"
          >
            <Languages size={14} />
            <span className="hidden text-[11px] font-medium uppercase min-[380px]:inline">
              {i18n.language}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" className="ml-0.5 rounded-full" />}
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

              <div className="grid grid-cols-2 gap-1 px-1 pb-1">
                {themes.map((item) => {
                  const ThemeIcon = item.icon
                  const active = theme === item.value

                  return (
                    <Button
                      key={item.value}
                      type="button"
                      onClick={() => setTheme(item.value)}
                      variant={active ? 'secondary' : 'ghost'}
                      size="sm"
                      className="justify-center gap-1.5 text-[11px]"
                    >
                      <ThemeIcon size={13} />
                      {item.label}
                    </Button>
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
