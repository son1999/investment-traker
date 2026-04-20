import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Coins,
  Languages,
  LogOut,
  Menu,
  Plus,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import HeaderQuickSearch from '@/components/layout/HeaderQuickSearch'
import { headerNavItems } from '@/components/layout/nav-items'
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

const logoUrl = '/logo.png'

export default function AppHeader() {
  const { t, i18n } = useTranslation()
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const activeItem =
    headerNavItems.find(
      (item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`),
    ) ?? headerNavItems[0]

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/6 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-[82px] sm:gap-3">
          <NavLink to="/dashboard" className="flex shrink-0 items-center gap-3">
            <img src={logoUrl} alt="Logo" className="h-8 w-auto sm:h-10" />
            <div className="hidden xl:flex xl:flex-col air-enter-quiet">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--palette-bg-primary-core)]">
                {t('app.brand')}
              </span>
              <span className="text-sm font-medium text-muted-foreground">{t(activeItem.key)}</span>
            </div>
          </NavLink>

          <HeaderQuickSearch />

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!user?.isGuest ? (
              <Button
                variant="ghost"
                size="sm"
                className="hidden xl:inline-flex air-enter-pop"
                onClick={() => navigate('/transactions')}
              >
                <Plus size={14} />
                {t('transactions.add')}
              </Button>
            ) : null}

            <Button variant="secondary" size="sm" onClick={toggleLang} className="gap-1.5 px-2.5 sm:gap-2">
              <Languages size={14} />
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] min-[380px]:inline">
                {i18n.language}
              </span>
            </Button>

            <Dialog>
              <DialogTrigger
                render={<Button variant="secondary" size="icon-sm" className="lg:hidden" />}
              >
                <Menu size={18} />
              </DialogTrigger>
              <DialogContent className="max-w-md p-0" showCloseButton>
                <DialogHeader className="border-b border-black/5 px-6 py-5">
                  <DialogTitle>{t('app.brand')}</DialogTitle>
                  <p className="text-sm text-muted-foreground">{user?.email || 'User'}</p>
                </DialogHeader>
                <div className="grid gap-2 px-4 py-4">
                  {headerNavItems.map((item) => (
                    <DialogClose
                      key={item.to}
                      render={
                        <Button
                          variant="ghost"
                          className={cn(
                            'h-auto w-full justify-between rounded-2xl px-4 py-4 text-left',
                            activeItem.to === item.to ? 'bg-[var(--palette-surface-subtle)]' : '',
                          )}
                        />
                      }
                      onClick={() => navigate(item.to)}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon size={16} />
                        {t(item.key)}
                      </span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </DialogClose>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" className="rounded-full" />}
              >
                <Avatar size="default">
                  <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={10} className="w-64">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{user?.email || 'User'}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <div className="px-3 pb-2 text-sm text-muted-foreground">
                  {user?.isGuest ? 'Preview mode enabled' : 'Curating your live portfolio'}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/transactions')}>
                  <Plus size={14} />
                  {t('transactions.add')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/prices')}>
                  <Coins size={14} />
                  {t('nav.prices')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    await logout()
                    navigate('/login')
                  }}
                >
                  <LogOut size={14} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <nav className="air-scroll-clean flex items-center gap-4 overflow-x-auto pt-1 pb-3 sm:gap-6">
          {headerNavItems.map((item) => {
            const isActive = activeItem.to === item.to

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'air-nav-link group flex min-w-[72px] shrink-0 flex-col items-center gap-2 border-b-2 pb-3 text-center text-[12px] font-medium transition-all sm:min-w-[86px] sm:text-[13px]',
                  isActive
                    ? 'border-foreground text-foreground opacity-100'
                    : 'border-transparent text-muted-foreground opacity-70 hover:opacity-100 hover:text-foreground',
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'transition-transform',
                    isActive ? 'scale-105 text-foreground' : 'text-muted-foreground',
                  )}
                />
                <span className="leading-none">{t(item.key)}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
