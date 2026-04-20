import { useState } from 'react'
import { ArrowLeft, ExternalLink, MoreVertical, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import SavingsAssetDetailView from './SavingsAssetDetailView'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAssetDetail, useAssetTransactions } from '@/hooks/useAssets'
import { useIsGuest } from '@/hooks/useIsGuest'
import type { Period } from '@/types/api'

const typeLabels: Record<string, string> = {
  metal: 'common.metal',
  crypto: 'common.crypto',
  stock: 'common.stock',
  savings: 'common.savings',
}

function formatAmount(value: number, currency: string): string {
  if (currency === 'VND') return `${value.toLocaleString('vi-VN')} ₫`
  return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${currency}`
}

function formatNumber(value: number, currency: string): string {
  if (currency === 'VND') return value.toLocaleString('vi-VN')
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
}

function currencySymbol(currency: string): string {
  return currency === 'VND' ? '₫' : currency
}

function buildHistory(values: number[]) {
  if (values.length < 2) return { line: '', area: '' }

  const width = 1120
  const height = 280
  const min = Math.min(...values) * 0.95
  const max = Math.max(...values) * 1.05
  const range = max - min || 1
  const step = width / (values.length - 1)
  const coords = values.map((value, index) => ({
    x: index * step,
    y: 16 + (1 - (value - min) / range) * (height - 32),
  }))
  const line = coords.map((point, index) => (index === 0 ? `M${point.x} ${point.y}` : `L${point.x} ${point.y}`)).join(' ')

  return { line, area: `${line} L${width} ${height} L0 ${height} Z` }
}

export default function AssetDetailScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { code } = useParams<{ code: string }>()
  const isGuest = useIsGuest()
  const [period, setPeriod] = useState<Period>('1y')

  const { data: asset, isLoading } = useAssetDetail(code || '')
  const { data: txRes } = useAssetTransactions(code || '', { period })

  if (isLoading || !asset) {
    return (
      <div className="air-page-tight">
        <Skeleton className="h-72 rounded-[32px]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32 rounded-[20px]" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-[20px]" />
      </div>
    )
  }

  if (asset.assetType === 'savings') {
    return <SavingsAssetDetailView asset={asset} onBack={() => navigate(-1)} />
  }

  const { holdings, avgCost, currentPrice, profit } = asset.metrics
  const currency = asset.currency || 'VND'
  const currencyUnit = currencySymbol(currency)
  const txRows = txRes?.data || []
  const valueHistory = asset.valueHistory || []
  const { line, area } = buildHistory(valueHistory.map((point) => point.value))
  const chartLabels = valueHistory.length
    ? valueHistory
        .filter((_, index) => index % Math.max(1, Math.floor(valueHistory.length / 4)) === 0 || index === valueHistory.length - 1)
        .map((point) => new Date(point.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }))
    : []

  const metrics = [
    {
      label: t('assetDetail.holdings'),
      value: String(holdings.quantity),
      unit: holdings.unit,
      sub: holdings.detail,
      tone: 'var(--foreground)',
    },
    {
      label: t('assetDetail.avgCost'),
      value: formatNumber(avgCost.value, currency),
      unit: currencyUnit,
      sub: `${t('assetDetail.totalCostLabel')}: ${formatAmount(asset.unrealizedPnl.totalCost, currency)}`,
      tone: 'var(--foreground)',
    },
    {
      label: t('assetDetail.currentPrice'),
      value: formatNumber(currentPrice.value, currency),
      unit: currencyUnit,
      sub: currentPrice.updatedAt ? new Date(currentPrice.updatedAt).toLocaleString('vi-VN') : '',
      tone: 'var(--palette-bg-primary-core)',
    },
    {
      label: t('assetDetail.profit'),
      value: `${profit.positive ? '+' : ''}${formatNumber(profit.amount, currency)}`,
      unit: currencyUnit,
      sub: `${profit.positive ? '+' : ''}${profit.percent.toFixed(2)}%`,
      tone: profit.positive ? 'var(--positive)' : 'var(--destructive)',
    },
  ]

  return (
    <div className="air-page-tight">
      <section className="air-surface-lg air-photo-art relative overflow-hidden px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} />
              {t('assetDetail.back')}
            </Button>
            {!isGuest ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm">
                  {t('assetDetail.updatePrice')}
                </Button>
                <Button size="sm">
                  <Plus size={14} />
                  {t('assetDetail.addTransaction')}
                </Button>
                <Button variant="secondary" size="icon-sm">
                  <MoreVertical size={16} />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex size-16 items-center justify-center rounded-full bg-white shadow-[var(--shadow-card)]"
                style={{ backgroundColor: asset.iconBg || '#fff' }}
              >
                <span className="text-[2rem]">{asset.icon}</span>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="air-section-eyebrow">{t(typeLabels[asset.assetType] || asset.assetType)}</span>
                  <Badge variant="outline">{asset.assetCode}</Badge>
                </div>
                <div className="space-y-2">
                  <h1 className="text-[clamp(2rem,4vw,3.2rem)] leading-[0.96] font-bold tracking-[-0.05em] text-foreground">
                    {asset.assetCode}
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {t('assetDetail.assetDescription')}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] bg-white/88 px-5 py-4 shadow-[var(--shadow-card)]">
              <p className="air-section-eyebrow">{t('dashboard.colValue')}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {formatAmount(asset.unrealizedPnl.currentValue, currency)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="air-surface px-5 py-5"
            style={{
              background:
                'linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)',
            }}
          >
            <p className="air-section-eyebrow">{metric.label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[1.65rem] leading-none font-semibold tracking-[-0.04em]" style={{ color: metric.tone }}>
                {metric.value}
              </span>
              <span className="text-sm text-muted-foreground">{metric.unit}</span>
              {metric.label === t('assetDetail.currentPrice') ? <ExternalLink size={12} className="text-muted-foreground" /> : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{metric.sub}</p>
          </article>
        ))}
      </div>

      <Card>
        <CardHeader className="lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle>{t('assetDetail.valueChart')}</CardTitle>
            <CardDescription>{t('assetDetail.valueChartDesc')}</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <TabsList>
              <TabsTrigger value="1m">{t('assetDetail.periodMonth')}</TabsTrigger>
              <TabsTrigger value="1y">{t('assetDetail.periodYear')}</TabsTrigger>
              <TabsTrigger value="all">{t('assetDetail.periodAll')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <div className="relative h-64 min-w-[520px] sm:h-72 sm:min-w-[640px]">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="absolute inset-x-0 border-t border-black/5"
                  style={{ top: `${item * 33.333}%` }}
                />
              ))}
              {line ? (
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1120 280" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="assetDetailArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,56,92,0.18)" />
                      <stop offset="100%" stopColor="rgba(255,56,92,0)" />
                    </linearGradient>
                  </defs>
                  <path d={area} fill="url(#assetDetailArea)" />
                  <path d={line} fill="none" stroke="var(--palette-bg-primary-core)" strokeWidth="4" strokeLinecap="round" />
                </svg>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 flex justify-between">
                {chartLabels.map((label, index) => (
                  <span key={`${label}-${index}`} className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="lg:flex-row lg:items-start lg:justify-between">
            <CardTitle>{t('assetDetail.realizedPnl')}</CardTitle>
            <Badge variant={asset.realizedPnl.total >= 0 ? 'default' : 'destructive'}>
              {asset.realizedPnl.total >= 0 ? '+' : ''}
              {formatAmount(asset.realizedPnl.total, currency)}
            </Badge>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid gap-3 px-4 md:hidden">
              {asset.realizedPnl.transactions.map((row, index) => (
                <article key={`${row.date}-${index}`} className="rounded-[18px] bg-[var(--palette-surface-subtle)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{new Date(row.date).toLocaleDateString('vi-VN')}</span>
                    <span className="text-sm font-semibold text-foreground">{formatAmount(row.profit, currency)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{row.quantity} {asset.assetCode}</p>
                </article>
              ))}
            </div>
            <div className="hidden md:block">
              <Table className="min-w-[480px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">{t('assetDetail.colDate')}</TableHead>
                    <TableHead>{t('assetDetail.colQty')}</TableHead>
                    <TableHead className="pr-6 text-right">{t('reports.profitLoss')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asset.realizedPnl.transactions.map((row, index) => (
                    <TableRow key={`${row.date}-${index}`}>
                      <TableCell className="pl-6">{new Date(row.date).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>{row.quantity} {asset.assetCode}</TableCell>
                      <TableCell className="pr-6 text-right">{formatAmount(row.profit, currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="lg:flex-row lg:items-start lg:justify-between">
            <CardTitle>{t('assetDetail.unrealizedPnl')}</CardTitle>
            <Badge variant={asset.unrealizedPnl.total >= 0 ? 'default' : 'destructive'}>
              {asset.unrealizedPnl.total >= 0 ? '+' : ''}
              {formatAmount(asset.unrealizedPnl.total, currency)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[var(--palette-surface-subtle)] px-4 py-4">
              <span className="text-sm text-muted-foreground">{t('assetDetail.currentValue')}</span>
              <span className="text-sm font-semibold text-foreground">
                {formatAmount(asset.unrealizedPnl.currentValue, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[var(--palette-surface-subtle)] px-4 py-4">
              <span className="text-sm text-muted-foreground">{t('assetDetail.totalCost')}</span>
              <span className="text-sm font-semibold text-foreground">
                {formatAmount(asset.unrealizedPnl.totalCost, currency)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('assetDetail.transactionsOf', { code: asset.assetCode })}</CardTitle>
          <CardDescription>{t('assetDetail.transactionsCount', { count: txRes?.meta?.total || 0 })}</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid gap-3 px-4 md:hidden">
            {txRows.map((row) => (
              <article key={row.id} className="rounded-[18px] bg-[var(--palette-surface-subtle)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{new Date(row.date).toLocaleDateString('vi-VN')}</p>
                    <Badge variant={row.action === 'MUA' ? 'default' : 'destructive'} className="mt-2">
                      {row.action === 'MUA' ? t('common.buy') : t('common.sell')}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon-xs">
                    <Pencil size={14} />
                  </Button>
                </div>
                <div className="mt-4 grid gap-3 text-xs min-[420px]:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">{t('assetDetail.colQty')}</p>
                    <p className="mt-1 text-foreground">{row.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">{t('assetDetail.colTotal')}</p>
                    <p className="mt-1 font-medium text-foreground">{formatAmount(row.total, currency)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{row.note || '—'}</p>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">{t('assetDetail.colDate')}</TableHead>
                  <TableHead>{t('assetDetail.colType')}</TableHead>
                  <TableHead>{t('assetDetail.colQty')}</TableHead>
                  <TableHead>{t('assetDetail.colUnitPrice')}</TableHead>
                  <TableHead>{t('assetDetail.colTotal')}</TableHead>
                  <TableHead>{t('assetDetail.colNote')}</TableHead>
                  <TableHead className="pr-6 text-right">{t('assetDetail.colAction')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-6">{new Date(row.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <Badge variant={row.action === 'MUA' ? 'default' : 'destructive'}>
                        {row.action === 'MUA' ? t('common.buy') : t('common.sell')}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{formatAmount(row.unitPrice, currency)}</TableCell>
                    <TableCell>{formatAmount(row.total, currency)}</TableCell>
                    <TableCell className="text-muted-foreground">{row.note || '—'}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="icon-xs">
                        <Pencil size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Pencil(props: { size: number }) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 18 18" fill="none">
      <path
        d="M12.75 2.25l3 3M2.25 12.75l-0.75 3.75 3.75-0.75L14.25 6.75l-3-3L2.25 12.75z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
