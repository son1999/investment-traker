import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Coins, Pencil, Plus, Trash2 } from 'lucide-react'

import { DataTableCard, EmptyState, PageHeader } from '@/components/app'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCreateCurrency, useCurrencies, useDeleteCurrency, useUpdateCurrency } from '@/hooks/useCurrencies'
import { useIsGuest } from '@/hooks/useIsGuest'
import type { Currency } from '@/types/api'

import CurrencyForm from './components/CurrencyForm'

export default function CurrenciesScreen() {
  const { t } = useTranslation()
  const isGuest = useIsGuest()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)
  const [deleteCode, setDeleteCode] = useState<string | null>(null)

  const { data: currencies, isLoading } = useCurrencies()
  const createCurrency = useCreateCurrency()
  const updateCurrency = useUpdateCurrency()
  const deleteCurrency = useDeleteCurrency()

  const items = currencies || []

  const handleSave = async (data: {
    code: string
    name: string
    symbol: string
    rateToVnd: number
  }) => {
    if (editingCurrency) {
      await updateCurrency.mutateAsync({
        code: editingCurrency.code,
        data: {
          name: data.name,
          symbol: data.symbol,
          rateToVnd: data.rateToVnd,
        },
      })
    } else {
      await createCurrency.mutateAsync(data)
    }
    setFormOpen(false)
    setEditingCurrency(null)
  }

  const handleDelete = async () => {
    if (!deleteCode) return
    await deleteCurrency.mutateAsync(deleteCode)
    setDeleteCode(null)
  }

  return (
    <div className="air-page">
      <PageHeader
        title={t('currencies.title')}
        description={t('currencies.subtitle')}
        actions={
          !isGuest ? (
            <Button onClick={() => setFormOpen(true)} size="lg" className="gap-2">
              <Plus size={14} />
              {t('currencies.addCurrency')}
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Coins size={48} />}
          description={t('currencies.noCurrencies')}
          action={
            !isGuest ? (
              <Button onClick={() => setFormOpen(true)} variant="outline" className="gap-2">
                <Plus size={14} />
                {t('currencies.addCurrency')}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <DataTableCard
          title={t('currencies.title')}
          description={t('currencies.count', { count: items.length })}
        >
          <div className="grid gap-3 p-4 md:hidden">
            {items.map((currency) => (
              <article key={currency.id} className="rounded-[18px] bg-[var(--palette-surface-subtle)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-foreground">{currency.code}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{currency.name}</p>
                  </div>
                  <p className="text-xl">{currency.symbol}</p>
                </div>
                <div className="mt-4 grid gap-3 text-xs min-[420px]:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">{t('currencies.colRate')}</p>
                    <p className="mt-1 font-mono text-foreground">{currency.rateToVnd.toLocaleString('vi-VN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">{t('currencies.colUpdated')}</p>
                    <p className="mt-1 text-foreground">{new Date(currency.updatedAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                {!isGuest ? (
                  <div className="mt-4 flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => {
                        setEditingCurrency(currency)
                        setFormOpen(true)
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setDeleteCode(currency.code)}
                    >
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">{t('currencies.colCode')}</TableHead>
                  <TableHead>{t('currencies.colName')}</TableHead>
                  <TableHead>{t('currencies.colSymbol')}</TableHead>
                  <TableHead className="text-right">{t('currencies.colRate')}</TableHead>
                  <TableHead>{t('currencies.colUpdated')}</TableHead>
                  {!isGuest ? <TableHead className="pr-6 text-right">{t('currencies.colActions')}</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((currency) => (
                  <TableRow key={currency.id}>
                    <TableCell className="pl-6 font-mono text-sm font-semibold">
                      {currency.code}
                    </TableCell>
                    <TableCell className="text-sm">{currency.name}</TableCell>
                    <TableCell className="text-lg">{currency.symbol}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold">
                      {currency.rateToVnd.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(currency.updatedAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    {!isGuest ? (
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => {
                              setEditingCurrency(currency)
                              setFormOpen(true)
                            }}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setDeleteCode(currency.code)}
                          >
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DataTableCard>
      )}

      <CurrencyForm
        key={`${editingCurrency?.code ?? 'new'}-${formOpen ? 'open' : 'closed'}`}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingCurrency(null)
        }}
        currency={editingCurrency}
        onSave={handleSave}
        isPending={createCurrency.isPending || updateCurrency.isPending}
      />

      <ConfirmDialog
        open={!!deleteCode}
        onOpenChange={(open) => {
          if (!open) setDeleteCode(null)
        }}
        title={t('common.delete')}
        description={t('currencies.confirmDelete', { code: deleteCode })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        isPending={deleteCurrency.isPending}
        variant="danger"
      />
    </div>
  )
}
