import { useTranslation } from 'react-i18next'
import { ArrowLeft, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { useIsGuest } from '@/hooks/useIsGuest'
import { useTransactionsUIStore } from '@/stores/transactions'
import { formatCurrency } from '@/lib/format'

function formatNum(value: number, currency: string): string {
  return value.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'VND' ? 0 : 8,
  })
}

interface SavingsDetailData {
  assetCode: string
  assetType: 'savings'
  currency: string
  icon: string
  iconBg: string
  bankName?: string | null
  interestRate?: number | null
  termMonths?: number | null
  maturityDate?: string | null
  metrics: {
    balance: { value: number; currency: string }
    principal: { value: number; currency: string }
    interestEarned: { value: number; currency: string }
    profit: { amount: number; percent: number; positive: boolean }
    eventCounts: { deposit: number; withdraw: number }
  }
  events: Array<{
    id: string
    type: string
    amount: number
    date: string
    note?: string | null
  }>
}

interface Props {
  asset: any
  onBack: () => void
}

const eventToneClass: Record<string, string> = {
  DEPOSIT: 'bg-positive/10 text-positive',
  INTEREST: 'bg-positive/10 text-positive',
  WITHDRAW: 'bg-destructive/10 text-destructive',
  FEE: 'bg-destructive/10 text-destructive',
  MATURITY: 'bg-muted text-foreground',
}

export default function SavingsAssetDetailView({ asset, onBack }: Props) {
  const { t } = useTranslation()
  const isGuest = useIsGuest()
  const { setShowForm } = useTransactionsUIStore()
  const data = asset as SavingsDetailData

  const { metrics, events } = data
  const cur = data.currency || 'VND'

  const cards = [
    {
      label: t('savings.balance'),
      value: formatNum(metrics.balance.value, cur),
      unit: cur === 'VND' ? '₫' : cur,
      border: '#3b82f6',
    },
    {
      label: t('savings.principal'),
      value: formatNum(metrics.principal.value, cur),
      unit: cur === 'VND' ? '₫' : cur,
      border: '#454747',
    },
    {
      label: t('savings.interestEarned'),
      value: (metrics.profit.positive && metrics.interestEarned.value > 0 ? '+' : '') + formatNum(metrics.interestEarned.value, cur),
      unit: cur === 'VND' ? '₫' : cur,
      border: metrics.profit.positive ? '#22c55e' : '#ef4444',
      isProfit: true,
      profitPositive: metrics.profit.positive,
      sub: `${metrics.profit.positive ? '+' : ''}${metrics.profit.percent.toFixed(2)}%`,
    },
    {
      label: t('savings.interestRate'),
      value: data.interestRate ? `${data.interestRate}` : '—',
      unit: '%/năm',
      border: '#f8a010',
      sub: data.termMonths ? `${t('savings.term')}: ${data.termMonths} ${t('savings.months')}` : '',
    },
  ]

  return (
    <div className="mx-auto min-w-0 max-w-[1400px] px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft size={13} />
          {t('assetDetail.back')}
        </Button>
        {!isGuest ? (
          <Button size="sm" className="gap-2" onClick={() => setShowForm(true)}>
            <Plus size={11} />
            {t('savings.addEvent')}
          </Button>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div
            className="flex size-14 items-center justify-center rounded-lg shadow-sm"
            style={{ backgroundColor: data.iconBg }}
          >
            <span className="text-[30px]">{data.icon}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {data.bankName || data.assetCode}
              </h1>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider">
                {t('common.savings')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.maturityDate
                ? `${t('savings.maturityDate')}: ${new Date(data.maturityDate).toLocaleDateString('vi-VN')}`
                : t('savings.openTerm')}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Card
              key={card.label}
              className="py-6 pl-6 pr-6"
              style={{ borderLeft: `2px solid ${card.border}` }}
            >
              <CardContent className="flex flex-col gap-2 p-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </span>
                <div className="flex items-baseline gap-1 pt-1">
                  <span
                    className={`font-['JetBrains_Mono'] text-xl font-semibold ${
                      card.isProfit
                        ? card.profitPositive
                          ? 'text-positive'
                          : 'text-destructive'
                        : 'text-foreground'
                    }`}
                  >
                    {card.value}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-sm text-muted-foreground">
                    {card.unit}
                  </span>
                </div>
                {card.sub ? (
                  card.isProfit ? (
                    <Badge
                      variant="secondary"
                      className={`w-fit text-[10px] font-bold ${
                        card.profitPositive
                          ? 'bg-positive/10 text-positive'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {card.sub}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">{card.sub}</span>
                  )
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>{t('savings.eventsTitle')}</CardTitle>
            <CardDescription>
              {t('savings.eventsCount', { count: events.length })}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-4 sm:pl-6 md:pl-8">
                    {t('assetDetail.colDate')}
                  </TableHead>
                  <TableHead>{t('savings.eventType')}</TableHead>
                  <TableHead className="text-right">{t('savings.amount')}</TableHead>
                  <TableHead>{t('assetDetail.colNote')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      {t('savings.noEvents')}
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((ev) => {
                    const positive = ev.type === 'DEPOSIT' || ev.type === 'INTEREST'
                    return (
                      <TableRow key={ev.id}>
                        <TableCell className="pl-4 font-['JetBrains_Mono'] text-sm sm:pl-6 md:pl-8">
                          {new Date(ev.date).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-bold ${
                              eventToneClass[ev.type] || 'bg-muted text-foreground'
                            }`}
                          >
                            {t(`savings.${ev.type.toLowerCase()}`)}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-['JetBrains_Mono'] text-sm ${
                            positive ? 'text-positive' : 'text-destructive'
                          }`}
                        >
                          {positive ? '+' : '−'}
                          {formatCurrency(ev.amount, cur)}
                        </TableCell>
                        <TableCell className="text-sm italic text-muted-foreground">
                          {ev.note || '—'}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
