import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { assetsApi, transactionsApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useTransactionsUIStore } from '@/stores/transactions'
import type { Asset, Transaction } from '@/types/api'
import { AssetIcon } from '@/components/ui/asset-icon'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { headerNavItems } from './nav-items'

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? ''
}

function matchesSearch(values: Array<string | null | undefined>, query: string) {
  if (!query) return true
  return values.some((value) => normalize(value).includes(query))
}

function ResultSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <div className="grid gap-2">{children}</div>
    </section>
  )
}

export default function HeaderQuickSearch({ className }: { className?: string }) {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const setTransactionSearch = useTransactionsUIStore((state) => state.setSearch)
  const setTransactionFilter = useTransactionsUIStore((state) => state.setFilter)
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const normalizedQuery = normalize(query)

  const { data: assets = [], isLoading: isAssetsLoading } = useQuery<Asset[]>({
    queryKey: ['header-search', 'assets'],
    queryFn: () => assetsApi.getAssets(),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  })

  const { data: recentTransactions = [], isLoading: isTransactionsLoading } = useQuery<
    Transaction[]
  >({
    queryKey: ['header-search', 'recent-transactions'],
    queryFn: () => transactionsApi.getRecentTransactions(8),
    enabled: open,
    staleTime: 60 * 1000,
  })

  const activeItem =
    headerNavItems.find(
      (item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`),
    ) ?? headerNavItems[0]

  const pageResults = useMemo(
    () =>
      headerNavItems
        .filter((item) =>
          matchesSearch([t(item.key), item.to.replace('/', ''), item.key], normalizedQuery),
        )
        .slice(0, 6),
    [normalizedQuery, t],
  )

  const assetResults = useMemo(
    () =>
      assets
        .filter((asset) =>
          matchesSearch(
            [asset.code, asset.name, asset.currency, t(`common.${asset.type}`)],
            normalizedQuery,
          ),
        )
        .slice(0, 6),
    [assets, normalizedQuery, t],
  )

  const transactionResults = useMemo(
    () =>
      recentTransactions
        .filter((tx) =>
          matchesSearch(
            [
              tx.assetCode,
              tx.note,
              t(tx.action === 'MUA' ? 'common.buy' : 'common.sell'),
              t(`common.${tx.assetType}`),
            ],
            normalizedQuery,
          ),
        )
        .slice(0, 6),
    [recentTransactions, normalizedQuery, t],
  )

  const isLoading = isAssetsLoading || isTransactionsLoading
  const hasResults = pageResults.length > 0 || assetResults.length > 0 || transactionResults.length > 0
  const shortcutLabel = i18n.language === 'vi' ? 'Ctrl K' : 'Cmd / Ctrl K'
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US'

  const closeSearch = () => {
    setOpen(false)
    setQuery('')
  }

  const openPage = (to: string) => {
    closeSearch()
    navigate(to)
  }

  const openAsset = (code: string) => {
    closeSearch()
    navigate(`/assets/${code}`)
  }

  const openTransaction = (tx: Transaction) => {
    setTransactionFilter(tx.assetType)
    setTransactionSearch(tx.assetCode)
    closeSearch()
    navigate('/transactions')
  }

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTypingTarget =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable

      if (isTypingTarget) return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  const handleEnter = () => {
    if (pageResults[0]) {
      openPage(pageResults[0].to)
      return
    }
    if (assetResults[0]) {
      openAsset(assetResults[0].code)
      return
    }
    if (transactionResults[0]) {
      openTransaction(transactionResults[0])
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('search.open')}
        className={cn(
          'air-search-shell hidden min-w-[420px] max-w-[640px] flex-1 lg:flex',
          className,
        )}
      >
        <span className="air-search-segment min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t('search.title')}
          </span>
          <span className="truncate text-sm font-semibold text-foreground">
            {t('search.subtitle')}
          </span>
        </span>
        <span className="h-8 w-px bg-black/6" />
        <span className="air-search-segment min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t('search.workspace')}
          </span>
          <span className="truncate text-sm text-foreground">
            {user?.isGuest ? t('search.previewMode') : t('search.livePortfolio')}
          </span>
        </span>
        <span className="ml-1 inline-flex size-12 items-center justify-center rounded-full bg-[var(--palette-bg-primary-core)] text-white shadow-[var(--shadow-card)]">
          <Search size={16} />
        </span>
      </button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) {
            setQuery('')
          }
        }}
      >
        <DialogContent className="max-w-4xl gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b border-black/5 px-6 py-5">
            <DialogTitle>{t('search.title')}</DialogTitle>
            <DialogDescription>{t('search.description')}</DialogDescription>
          </DialogHeader>

          <div className="border-b border-black/5 px-6 py-5">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleEnter()
                  }
                }}
                placeholder={t('search.placeholder')}
                className="h-12 rounded-full border-black/6 pl-11 pr-24 shadow-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-black/6 bg-[var(--palette-surface-subtle)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {shortcutLabel}
              </span>
            </div>
          </div>

          <div className="max-h-[68vh] overflow-y-auto px-4 py-4 sm:px-6">
            {isLoading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-18 rounded-[20px]" />
                ))}
              </div>
            ) : hasResults ? (
              <div className="space-y-6 py-1">
                {pageResults.length > 0 ? (
                  <ResultSection title={t('search.pages')}>
                    {pageResults.map((item) => (
                      <button
                        key={item.to}
                        type="button"
                        onClick={() => openPage(item.to)}
                        className={cn(
                          'air-interactive-card air-hover-shift flex w-full items-center justify-between gap-4 rounded-[22px] border border-black/5 bg-white px-4 py-4 text-left transition-colors hover:bg-[var(--palette-surface-subtle)]',
                          activeItem.to === item.to ? 'ring-1 ring-[color:rgba(255,56,92,0.16)]' : '',
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--palette-surface-subtle)]">
                            <item.icon size={18} className="text-[var(--palette-bg-primary-core)]" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {t(item.key)}
                            </span>
                            <span className="block truncate text-sm text-muted-foreground">
                              {item.to}
                            </span>
                          </span>
                        </span>
                        <ArrowUpRight size={16} data-air-icon="trail" className="shrink-0 text-muted-foreground" />
                      </button>
                    ))}
                  </ResultSection>
                ) : null}

                {assetResults.length > 0 ? (
                  <ResultSection title={t('search.assets')}>
                    {assetResults.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => openAsset(asset.code)}
                        className="air-interactive-card air-hover-shift flex w-full items-center justify-between gap-4 rounded-[22px] border border-black/5 bg-white px-4 py-4 text-left transition-colors hover:bg-[var(--palette-surface-subtle)]"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <AssetIcon
                            code={asset.code}
                            assetType={asset.type}
                            fallback={asset.icon}
                            fallbackBg={asset.iconBg}
                            sizeClass="size-10"
                          />
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="truncate text-sm font-semibold text-foreground">
                                {asset.code}
                              </span>
                              <Badge variant="outline">{t(`common.${asset.type}`)}</Badge>
                            </span>
                            <span className="block truncate text-sm text-muted-foreground">
                              {asset.name}
                            </span>
                          </span>
                        </span>
                        <ArrowUpRight size={16} data-air-icon="trail" className="shrink-0 text-muted-foreground" />
                      </button>
                    ))}
                  </ResultSection>
                ) : null}

                {transactionResults.length > 0 ? (
                  <ResultSection title={t('search.transactions')}>
                    {transactionResults.map((tx) => (
                      <button
                        key={tx.id}
                        type="button"
                        onClick={() => openTransaction(tx)}
                        className="air-interactive-card air-hover-shift flex w-full items-center justify-between gap-4 rounded-[22px] border border-black/5 bg-white px-4 py-4 text-left transition-colors hover:bg-[var(--palette-surface-subtle)]"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <AssetIcon
                            code={tx.assetCode}
                            assetType={tx.assetType}
                            fallback={tx.icon}
                            fallbackBg={tx.iconBg}
                            sizeClass="size-10"
                          />
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="truncate text-sm font-semibold text-foreground">
                                {tx.assetCode}
                              </span>
                              <Badge variant={tx.action === 'MUA' ? 'default' : 'destructive'}>
                                {t(tx.action === 'MUA' ? 'common.buy' : 'common.sell')}
                              </Badge>
                            </span>
                            <span className="block truncate text-sm text-muted-foreground">
                              {new Date(tx.date).toLocaleDateString(locale)} ·{' '}
                              {tx.note || t('transactions.title')}
                            </span>
                          </span>
                        </span>
                        <ArrowUpRight size={16} data-air-icon="trail" className="shrink-0 text-muted-foreground" />
                      </button>
                    ))}
                  </ResultSection>
                ) : null}
              </div>
            ) : (
              <div className="air-surface-muted flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
                <p className="text-base font-semibold text-foreground">{t('search.emptyTitle')}</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  {t('search.emptyDescription')}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
