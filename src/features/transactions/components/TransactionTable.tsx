import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  Trash2,
} from 'lucide-react'

import { StatusBadge } from '@/components/app'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AssetIcon } from '@/components/ui/asset-icon'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTransactions, useDeleteTransaction } from '@/hooks/useTransactions'
import { useDeleteSavingsEvent } from '@/hooks/useSavingsEvents'
import { useIsGuest } from '@/hooks/useIsGuest'
import { useTransactionsUIStore } from '@/stores/transactions'
import type { AssetType, Transaction } from '@/types/api'

function formatVND(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} ₫`
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'VND') return formatVND(amount)
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })} ${currency}`
}

function formatQuantity(qty: number): string {
  return qty.toLocaleString('en-US', { maximumFractionDigits: 8 })
}

export default function TransactionTable() {
  const { t } = useTranslation()
  const isGuest = useIsGuest()
  const {
    filter,
    search,
    page,
    limit,
    setPage,
    setLimit,
    startEdit,
  } = useTransactionsUIStore()

  const { data, isLoading } = useTransactions({
    filter: (filter || undefined) as AssetType | undefined,
    search: search || undefined,
    page,
    limit,
  })

  const deleteTransaction = useDeleteTransaction()
  const deleteSavingsEvent = useDeleteSavingsEvent()
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null)

  const confirmDelete = () => {
    if (!txToDelete) return
    if (txToDelete.assetType === 'savings') {
      deleteSavingsEvent.mutate(txToDelete.id)
    } else {
      deleteTransaction.mutate(txToDelete.id)
    }
    setTxToDelete(null)
  }

  const transactions = data?.data || []
  const meta = data?.meta
  const totalPages = meta?.pages || 1

  if (isLoading) return <Skeleton className="h-96 w-full rounded-lg" />

  return (
    <>
      <div className="w-full min-w-0 overflow-hidden rounded-xl border bg-card">
        <div className="air-stagger-grid grid gap-3 p-4 lg:hidden">
          {transactions.map((tx) => {
            const isBuy = tx.action === 'MUA'
            return (
              <article key={tx.id} className="air-interactive-card rounded-[18px] bg-[var(--palette-surface-subtle)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AssetIcon
                      code={tx.assetCode}
                      assetType={tx.assetType}
                      fallback={tx.icon}
                      fallbackBg={tx.iconBg}
                      sizeClass="size-9"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{tx.assetCode}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <StatusBadge tone={isBuy ? 'positive' : 'negative'}>
                    {isBuy ? t('common.buy') : t('common.sell')}
                  </StatusBadge>
                </div>
                <div className="mt-4 grid gap-3 text-xs min-[420px]:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">{t('dashboard.colQty')}</p>
                    <p className="mt-1 font-mono text-foreground">{formatQuantity(tx.quantity)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">{t('transactions.total')}</p>
                    <p className="mt-1 font-mono font-semibold text-foreground">
                      {formatCurrency(tx.quantity * tx.unitPrice, tx.currency)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{tx.note || '—'}</p>
                {!isGuest ? (
                  <div className="mt-4 flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon-xs" onClick={() => startEdit(tx)}>
                      <Pencil size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setTxToDelete(tx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>

        <div className="hidden lg:block">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">{t('assetDetail.colDate')}</TableHead>
                <TableHead className="pl-12">{t('dashboard.colAsset')}</TableHead>
                <TableHead>{t('dashboard.colType')}</TableHead>
                <TableHead className="text-right">{t('dashboard.colQty')}</TableHead>
                <TableHead className="text-right">{t('assetDetail.colUnitPrice')}</TableHead>
                <TableHead className="text-right">{t('transactions.total')}</TableHead>
                <TableHead>{t('transactions.note')}</TableHead>
                {!isGuest ? <TableHead className="text-center">Actions</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => {
                const isBuy = tx.action === 'MUA'

                return (
                  <TableRow key={tx.id}>
                    <TableCell className="px-6 font-mono text-sm text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-2">
                        <AssetIcon
                          code={tx.assetCode}
                          assetType={tx.assetType}
                          fallback={tx.icon}
                          fallbackBg={tx.iconBg}
                          sizeClass="size-6"
                        />
                        <span className="text-base font-semibold">{tx.assetCode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <StatusBadge tone={isBuy ? 'positive' : 'negative'}>
                        {isBuy ? t('common.buy') : t('common.sell')}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="px-6 text-right font-mono text-sm text-foreground/80">
                      {formatQuantity(tx.quantity)}
                    </TableCell>
                    <TableCell className="px-6 text-right font-mono text-sm text-foreground/80">
                      {tx.assetType === 'savings' ? '—' : formatCurrency(tx.unitPrice, tx.currency)}
                    </TableCell>
                    <TableCell className="px-6 text-right font-mono text-sm font-semibold">
                      {formatCurrency(tx.quantity * tx.unitPrice, tx.currency)}
                    </TableCell>
                    <TableCell className="px-6 text-sm text-muted-foreground">
                      {tx.note || '—'}
                    </TableCell>
                    {!isGuest ? (
                      <TableCell className="px-6">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => startEdit(tx)}
                          >
                            <Pencil size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setTxToDelete(tx)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 border-t bg-muted/30 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <span className="text-sm text-muted-foreground">
              {t('transactions.showing')}{' '}
              <span className="font-medium text-foreground">
                {meta && meta.total > 0
                  ? `${(page - 1) * limit + 1}-${Math.min(page * limit, meta.total)}`
                  : '0'}
              </span>{' '}
              {t('transactions.of')}{' '}
              <span className="font-medium text-foreground">{meta?.total || 0}</span> giao dịch
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('transactions.rowsPerPage', 'Hiển thị')}
              </span>
              <Select value={String(limit)} onValueChange={(val) => val && setLimit(Number(val))}>
                <SelectTrigger className="h-8 w-[72px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {meta && meta.total > 0 ? (
            <div className="flex flex-wrap items-center gap-1">
              <Button variant="outline" size="icon-xs" onClick={() => setPage(1)} disabled={page <= 1}>
                <ChevronsLeft size={12} />
              </Button>
              <Button variant="outline" size="icon-xs" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                <ChevronLeft size={12} />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'ghost'}
                  size="icon-xs"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              {totalPages > 5 ? <span className="px-1 text-muted-foreground">...</span> : null}
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight size={12} />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
              >
                <ChevronsRight size={12} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <AlertDialog open={txToDelete !== null} onOpenChange={(open) => !open && setTxToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá giao dịch?</AlertDialogTitle>
            <AlertDialogDescription>
              {txToDelete
                ? `Xoá giao dịch ${txToDelete.assetCode} ngày ${new Date(txToDelete.date).toLocaleDateString('vi-VN')}. Hành động này không thể hoàn tác.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
