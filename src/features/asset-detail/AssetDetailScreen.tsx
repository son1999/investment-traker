import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Plus, MoreVertical, ExternalLink } from 'lucide-react'
import { useAssetDetail, useAssetTransactions } from '@/hooks/useAssets'
import SavingsAssetDetailView from './SavingsAssetDetailView'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsGuest } from '@/hooks/useIsGuest'
import type { Period } from '@/types/api'

const typeLabels: Record<string, string> = { metal: 'common.metal', crypto: 'common.crypto', stock: 'common.stock', savings: 'common.savings' }

function formatAmount(v: number, currency: string): string {
  if (currency === 'VND') return v.toLocaleString('vi-VN') + ' ₫'
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) + ' ' + currency
}

function formatNumber(v: number, currency: string): string {
  if (currency === 'VND') return v.toLocaleString('vi-VN')
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
}

function currencySymbol(currency: string): string {
  if (currency === 'VND') return '₫'
  return currency
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
      <div className="mx-auto min-w-0 max-w-[1400px] px-4 py-6 sm:px-6">
        <Skeleton className="mb-6 h-8 w-32" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
        <Skeleton className="mt-6 h-80 rounded-2xl" />
      </div>
    )
  }

  if (asset.assetType === 'savings') {
    return <SavingsAssetDetailView asset={asset} onBack={() => navigate(-1)} />
  }

  const { holdings, avgCost, currentPrice, profit } = asset.metrics
  const cur = asset.currency || 'VND'
  const curSym = currencySymbol(cur)
  const metrics = [
    { label: t('assetDetail.holdings'), value: String(holdings.quantity), unit: holdings.unit, sub: holdings.detail, border: '#454747' },
    { label: t('assetDetail.avgCost'), value: formatNumber(avgCost.value, cur), unit: curSym, sub: `${t('assetDetail.totalCostLabel')}: ${formatAmount(asset.unrealizedPnl.totalCost, cur)}`, border: '#454747' },
    { label: t('assetDetail.currentPrice'), value: formatNumber(currentPrice.value, cur), unit: curSym, sub: currentPrice.updatedAt ? new Date(currentPrice.updatedAt).toLocaleString('vi-VN') : '', border: '#f8a010', hasRefresh: true },
    { label: t('assetDetail.profit'), value: (profit.positive ? '+' : '') + formatNumber(profit.amount, cur), unit: curSym, sub: `${profit.positive ? '+' : ''}${profit.percent.toFixed(2)}%`, border: profit.positive ? '#22c55e' : '#ef4444', isProfit: true, profitPositive: profit.positive },
  ]

  const txRows = txRes?.data || []
  const valueHistory = asset.valueHistory || []

  const svgW = 1120, svgH = 264
  let svgLine = '', svgArea = ''
  if (valueHistory.length >= 2) {
    const pts = valueHistory.map(p => p.value)
    const min = Math.min(...pts) * 0.95, max = Math.max(...pts) * 1.05, range = max - min || 1
    const step = svgW / (pts.length - 1)
    const coords = pts.map((v, i) => ({ x: i * step, y: 10 + (1 - (v - min) / range) * (svgH - 20) }))
    svgLine = coords.map((c, i) => (i === 0 ? `M${c.x} ${c.y}` : `L${c.x} ${c.y}`)).join(' ')
    svgArea = `${svgLine} L${svgW} ${svgH} L0 ${svgH} Z`
  }

  const chartLabels = valueHistory.length > 0
    ? valueHistory.filter((_, i) => i % Math.max(1, Math.floor(valueHistory.length / 4)) === 0 || i === valueHistory.length - 1)
        .map(p => new Date(p.date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }))
    : []

  return (
    <div className="mx-auto min-w-0 max-w-[1400px] px-4 pb-16 pt-6 sm:px-6">
      {/* Back bar */}
      <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground">
          <ArrowLeft size={13} />{t('assetDetail.back')}
        </Button>
        {!isGuest && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">{t('assetDetail.updatePrice')}</Button>
            <Button size="sm" className="gap-2"><Plus size={11} />{t('assetDetail.addTransaction')}</Button>
            <Button variant="ghost" size="icon-sm"><MoreVertical size={16} /></Button>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-10">
        {/* Asset Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex size-14 items-center justify-center rounded-lg shadow-sm" style={{ backgroundColor: asset.iconBg }}>
            <span className="text-[30px]">{asset.icon}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{asset.assetCode}</h1>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider">{t(typeLabels[asset.assetType] || asset.assetType)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{t('assetDetail.assetDescription')}</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(m => (
            <Card key={m.label} className="py-6 pl-6 pr-6" style={{ borderLeft: `2px solid ${m.border}` }}>
              <CardContent className="flex flex-col gap-2 p-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{m.label}</span>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className={`font-['JetBrains_Mono'] text-xl font-semibold ${m.isProfit ? (m.profitPositive ? 'text-positive' : 'text-destructive') : 'text-foreground'}`}>{m.value}</span>
                  <span className={`font-['JetBrains_Mono'] text-sm ${m.isProfit ? (m.profitPositive ? 'text-positive/70' : 'text-destructive/70') : 'text-muted-foreground'}`}>{m.unit}</span>
                  {m.hasRefresh && <ExternalLink size={9} className="ml-1 text-muted-foreground" />}
                </div>
                {m.isProfit
                  ? <Badge variant="secondary" className={`w-fit text-[10px] font-bold ${m.profitPositive ? 'bg-positive/10 text-positive' : 'bg-destructive/10 text-destructive'}`}>{m.sub}</Badge>
                  : <span className="text-xs text-muted-foreground">{m.sub}</span>
                }
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div><CardTitle className="text-xl">{t('assetDetail.valueChart')}</CardTitle><CardDescription>{t('assetDetail.valueChartDesc')}</CardDescription></div>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList className="h-auto flex-wrap">
                <TabsTrigger value="1m">{t('assetDetail.periodMonth')}</TabsTrigger>
                <TabsTrigger value="1y">{t('assetDetail.periodYear')}</TabsTrigger>
                <TabsTrigger value="all">{t('assetDetail.periodAll')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="relative h-80 min-w-[640px]">
              {[0,1,2,3].map(i => <div key={i} className="absolute left-0 right-0 border-t border-border opacity-30" style={{ top: `${8 + i * (304 / 3)}px` }} />)}
              {svgLine && (
                <svg className="absolute left-0 top-6 h-66 w-full" viewBox={`0 0 ${svgW} ${svgH}`} fill="none" preserveAspectRatio="none">
                  <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8a010" stopOpacity="0.15" /><stop offset="100%" stopColor="#f8a010" stopOpacity="0" /></linearGradient></defs>
                  <path d={svgArea} fill="url(#chartGrad)" /><path d={svgLine} stroke="#f8a010" strokeWidth="2" fill="none" />
                </svg>
              )}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">{chartLabels.map((label, index) => <span key={`${label}-${index}`} className="font-['JetBrains_Mono'] text-[10px] uppercase text-muted-foreground">{label}</span>)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* P&L Details */}
        <div className="grid gap-6 xl:grid-cols-2">
          <Card style={{ borderLeft: '2px solid rgba(34,197,94,0.3)' }}>
            <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('assetDetail.realizedPnl')}</CardTitle>
              <span className="font-['JetBrains_Mono'] text-lg font-bold text-positive">{asset.realizedPnl.total >= 0 ? '+' : ''}{formatAmount(asset.realizedPnl.total, cur)}</span>
            </CardHeader>
            <CardContent className="p-0 px-6 pb-6">
              <Table className="min-w-[480px]">
                <TableHeader><TableRow className="hover:bg-transparent"><TableHead>{t('assetDetail.colDate')}</TableHead><TableHead>{t('assetDetail.colQty')}</TableHead><TableHead className="text-right">{t('reports.profitLoss')}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {asset.realizedPnl.transactions.map((rpnl, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs">{new Date(rpnl.date).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell className="font-['JetBrains_Mono'] text-xs">{rpnl.quantity} {asset.assetCode}</TableCell>
                      <TableCell className={`text-right font-['JetBrains_Mono'] text-xs ${rpnl.profit >= 0 ? 'text-positive' : 'text-destructive'}`}>{rpnl.profit >= 0 ? '+' : ''}{formatAmount(rpnl.profit, cur)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card style={{ borderLeft: '2px solid rgba(248,160,16,0.3)' }}>
            <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('assetDetail.unrealizedPnl')}</CardTitle>
              <span className={`font-['JetBrains_Mono'] text-lg font-bold ${asset.unrealizedPnl.total >= 0 ? 'text-positive' : 'text-destructive'}`}>{asset.unrealizedPnl.total >= 0 ? '+' : ''}{formatAmount(asset.unrealizedPnl.total, cur)}</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b pb-2 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs text-muted-foreground">{t('assetDetail.currentValue')}</span><span className="font-['JetBrains_Mono'] text-xs">{formatAmount(asset.unrealizedPnl.currentValue, cur)}</span></div>
              <div className="flex flex-col gap-1 border-b pb-2 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs text-muted-foreground">{t('assetDetail.totalCost')}</span><span className="font-['JetBrains_Mono'] text-xs">{formatAmount(asset.unrealizedPnl.totalCost, cur)}</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{t('assetDetail.transactionsOf', { code: asset.assetCode })}</CardTitle>
            <CardDescription>{t('assetDetail.transactionsCount', { count: txRes?.meta?.total || 0 })}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-4 sm:pl-6 md:pl-8">{t('assetDetail.colDate')}</TableHead>
                  <TableHead>{t('assetDetail.colType')}</TableHead>
                  <TableHead>{t('assetDetail.colQty')}</TableHead>
                  <TableHead>{t('assetDetail.colUnitPrice')}</TableHead>
                  <TableHead>{t('assetDetail.colTotal')}</TableHead>
                  <TableHead>{t('assetDetail.colNote')}</TableHead>
                  <TableHead className="pr-4 text-right sm:pr-6 md:pr-8">{t('assetDetail.colAction')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txRows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4 font-['JetBrains_Mono'] text-sm sm:pl-6 md:pl-8">{new Date(row.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <Badge variant={row.action === 'MUA' ? 'secondary' : 'destructive'} className={`text-[10px] font-bold ${row.action === 'MUA' ? 'bg-positive/10 text-positive' : ''}`}>
                        {row.action === 'MUA' ? t('common.buy') : t('common.sell')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-['JetBrains_Mono'] text-sm">{row.quantity}</TableCell>
                    <TableCell className="font-['JetBrains_Mono'] text-sm">{formatAmount(row.unitPrice, cur)}</TableCell>
                    <TableCell className="font-['JetBrains_Mono'] text-sm">{formatAmount(row.total, cur)}</TableCell>
                    <TableCell className="text-sm italic text-muted-foreground">{row.note || '—'}</TableCell>
                    <TableCell className="pr-4 text-right sm:pr-6 md:pr-8">
                      <Button variant="ghost" size="icon-xs"><Pencil size={14} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Pencil(props: { size: number }) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 18 18" fill="none">
      <path d="M12.75 2.25l3 3M2.25 12.75l-0.75 3.75 3.75-0.75L14.25 6.75l-3-3L2.25 12.75z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
