import { NavLink } from 'react-router-dom'
import { Sun, Moon, Monitor, Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore, type Theme } from '@/stores/theme'
import iconSvg from '@/assets/icon.svg'

const navKeys = [
  { key: 'nav.dashboard', to: '/dashboard' },
  { key: 'nav.transactions', to: '/transactions' },
  { key: 'nav.reports', to: '/reports' },
  { key: 'nav.prices', to: '/prices' },
  { key: 'nav.journal', to: '/journal' },
  { key: 'nav.settings', to: '/settings' },
]

const themeOrder: Theme[] = ['dark', 'light', 'system']
const themeIcons = { light: Sun, dark: Moon, system: Monitor }

export default function AppHeader() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useThemeStore()
  const Icon = themeIcons[theme]

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme)
    setTheme(themeOrder[(idx + 1) % themeOrder.length])
  }

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-edge bg-page">
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-6">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded border border-edge bg-panel">
            <img src={iconSvg} alt="" className="size-3.5" />
          </div>
          <span className="text-sm font-semibold text-heading">{t('app.name')}</span>
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
          <button
            onClick={cycleTheme}
            className="flex cursor-pointer items-center justify-center rounded-md p-2 text-caption transition-colors hover:bg-edge-subtle hover:text-heading"
          >
            <Icon size={15} />
          </button>
          <div className="ml-1 size-7 overflow-hidden rounded-full border border-edge bg-panel">
            <div className="flex size-full items-center justify-center text-[11px] font-medium text-caption">U</div>
          </div>
        </div>
      </div>
    </header>
  )
}
