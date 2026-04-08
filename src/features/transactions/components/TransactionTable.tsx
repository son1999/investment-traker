import { useTranslation } from 'react-i18next'
import { useTransactionsUIStore } from '@/stores/transactions'
import { useTransactions, useDeleteTransaction, useBulkDeleteTransactions } from '@/hooks/useTransactions'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { AssetType } from '@/types/api'

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' ₫'
}

export default function TransactionTable() {
  const { t } = useTranslation()
  const { filter, search, page, setPage, selectedIds, toggleSelect, selectAll, deselectAll } = useTransactionsUIStore()

  const { data, isLoading } = useTransactions({
    filter: (filter || undefined) as AssetType | undefined,
    search: search || undefined,
    page,
    limit: 20,
  })

  const deleteTx = useDeleteTransaction()
  const bulkDelete = useBulkDeleteTransactions()

  const transactions = data?.data || []
  const meta = data?.meta
  const totalPages = meta?.pages || 1
  const allSelected = transactions.length > 0 && transactions.every((tx) => selectedIds.includes(tx.id))

  if (isLoading) return <Skeleton className="h-96 w-full rounded-lg" />

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-edge-subtle bg-panel">
        <Table>
          <TableHeader>
            <TableRow className="bg-panel-alt hover:bg-panel-alt">
              <TableHead className="w-16 px-6">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => allSelected ? deselectAll() : selectAll(transactions.map((tx) => tx.id))}
                />
              </TableHead>
              <TableHead className="pl-6">{t('assetDetail.colDate')}</TableHead>
              <TableHead className="pl-12">{t('dashboard.colAsset')}</TableHead>
              <TableHead>{t('dashboard.colType')}</TableHead>
              <TableHead className="text-right">{t('dashboard.colQty')}</TableHead>
              <TableHead className="text-right">{t('assetDetail.colUnitPrice')}</TableHead>
              <TableHead className="text-right">{t('transactions.total')}</TableHead>
              <TableHead>{t('transactions.note')}</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const isSelected = selectedIds.includes(tx.id)
              const isBuy = tx.action === 'MUA'
              return (
                <TableRow key={tx.id} data-state={isSelected ? 'selected' : undefined}>
                  <TableCell className="w-16 px-6">
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(tx.id)} />
                  </TableCell>
                  <TableCell className="px-6 font-['JetBrains_Mono'] text-sm text-caption">{new Date(tx.date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full text-[10px]" style={{ backgroundColor: tx.iconBg }}>{tx.icon}</div>
                      <span className="text-base font-semibold text-heading">{tx.assetCode}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge variant={isBuy ? 'secondary' : 'destructive'} className={`text-[10px] font-bold uppercase ${isBuy ? 'bg-positive/10 text-positive' : ''}`}>
                      {isBuy ? t('common.buy') : t('common.sell')}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right font-['JetBrains_Mono'] text-sm text-body">{tx.quantity.toLocaleString('en-US')}</TableCell>
                  <TableCell className="px-6 text-right font-['JetBrains_Mono'] text-sm text-body">{formatVND(tx.unitPrice)}</TableCell>
                  <TableCell className="px-6 text-right font-['JetBrains_Mono'] text-sm font-bold text-heading">{formatVND(tx.quantity * tx.unitPrice)}</TableCell>
                  <TableCell className="px-6 text-sm text-caption">{tx.note || '—'}</TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon-xs"><Pencil size={13} /></Button>
                      <Button variant="ghost" size="icon-xs" onClick={() => deleteTx.mutate(tx.id)}><Trash2 size={13} className="text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-edge-subtle bg-panel-alt px-6 py-4">
          <span className="text-sm text-caption">
            {t('transactions.showing')} <span className="font-medium text-heading">{meta ? `${(page - 1) * meta.limit + 1}-${Math.min(page * meta.limit, meta.total)}` : '0'}</span>
            {t('transactions.of')} <span className="font-medium text-heading">{meta?.total || 0}</span> giao dịch
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-xs" onClick={() => setPage(1)} disabled={page <= 1}><ChevronsLeft size={12} /></Button>
            <Button variant="outline" size="icon-xs" onClick={() => setPage(page - 1)} disabled={page <= 1}><ChevronLeft size={12} /></Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? 'default' : 'ghost'} size="icon-xs" onClick={() => setPage(p)}>{p}</Button>
            ))}
            {totalPages > 5 && <span className="px-1 text-muted-foreground">...</span>}
            <Button variant="outline" size="icon-xs" onClick={() => setPage(page + 1)} disabled={page >= totalPages}><ChevronRight size={12} /></Button>
            <Button variant="outline" size="icon-xs" onClick={() => setPage(totalPages)} disabled={page >= totalPages}><ChevronsRight size={12} /></Button>
          </div>
        </div>
      </div>

      {/* Floating bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-xl border border-edge-strong bg-popover px-6 py-3.5 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-sm font-semibold text-heading">{t('transactions.selected', { count: selectedIds.length })}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={() => { bulkDelete.mutate(selectedIds); deselectAll() }}>
              <Trash2 size={12} /> {t('transactions.delete')}
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>{t('transactions.deselect')}</Button>
          </div>
        </div>
      )}
    </>
  )
}
