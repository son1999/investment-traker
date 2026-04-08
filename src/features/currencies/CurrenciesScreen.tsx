import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Coins } from 'lucide-react'
import { useCurrencies, useCreateCurrency, useUpdateCurrency, useDeleteCurrency } from '@/hooks/useCurrencies'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import CurrencyForm from './components/CurrencyForm'
import type { Currency } from '@/types/api'

export default function CurrenciesScreen() {
  const { t } = useTranslation()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)

  const { data: currencies, isLoading } = useCurrencies()
  const createCurrency = useCreateCurrency()
  const updateCurrency = useUpdateCurrency()
  const deleteCurrency = useDeleteCurrency()

  const items = currencies || []

  const handleSave = async (data: { code: string; name: string; symbol: string; rateToVnd: number }) => {
    if (editingCurrency) {
      await updateCurrency.mutateAsync({ code: editingCurrency.code, data: { name: data.name, symbol: data.symbol, rateToVnd: data.rateToVnd } })
    } else {
      await createCurrency.mutateAsync(data)
    }
    setFormOpen(false)
    setEditingCurrency(null)
  }

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency)
    setFormOpen(true)
  }

  const handleDelete = async (code: string) => {
    if (!confirm(t('currencies.confirmDelete', { code }))) return
    await deleteCurrency.mutateAsync(code)
  }

  const handleAdd = () => {
    setEditingCurrency(null)
    setFormOpen(true)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-heading">{t('currencies.title')}</h1>
          <p className="text-sm text-caption">{t('currencies.subtitle')}</p>
        </div>
        <Button onClick={handleAdd} size="lg" className="gap-2">
          <Plus size={14} />
          {t('currencies.addCurrency')}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <Coins size={48} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t('currencies.noCurrencies')}</p>
            <Button onClick={handleAdd} variant="outline" className="gap-2">
              <Plus size={14} />
              {t('currencies.addCurrency')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-edge">
          <CardHeader className="flex-row items-center justify-between border-b border-edge-subtle">
            <div>
              <CardTitle>{t('currencies.title')}</CardTitle>
              <CardDescription>{t('currencies.count', { count: items.length })}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">{t('currencies.colCode')}</TableHead>
                  <TableHead>{t('currencies.colName')}</TableHead>
                  <TableHead>{t('currencies.colSymbol')}</TableHead>
                  <TableHead className="text-right">{t('currencies.colRate')}</TableHead>
                  <TableHead>{t('currencies.colUpdated')}</TableHead>
                  <TableHead className="pr-6 text-right">{t('currencies.colActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-6 font-['JetBrains_Mono'] text-sm font-bold text-heading">{c.code}</TableCell>
                    <TableCell className="text-sm">{c.name}</TableCell>
                    <TableCell className="text-lg">{c.symbol}</TableCell>
                    <TableCell className="text-right font-['JetBrains_Mono'] text-sm font-bold text-heading">{c.rateToVnd.toLocaleString('vi-VN')}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(c.updatedAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-xs" onClick={() => handleEdit(c)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(c.code)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <CurrencyForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingCurrency(null) }}
        currency={editingCurrency}
        onSave={handleSave}
        isPending={createCurrency.isPending || updateCurrency.isPending}
      />
    </div>
  )
}
