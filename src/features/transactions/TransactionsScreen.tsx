import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTransactionsUIStore } from '@/stores/transactions'
import TransactionForm from './components/TransactionForm'
import TransactionFilters from './components/TransactionFilters'
import TransactionTable from './components/TransactionTable'
import CSVImport from './components/CSVImport'
import { Plus, Search, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsGuest } from '@/hooks/useIsGuest'

export default function TransactionsScreen() {
  const { t } = useTranslation()
  const { showForm, setShowForm, search, setSearch } = useTransactionsUIStore()
  const [showCSVImport, setShowCSVImport] = useState(false)
  const isGuest = useIsGuest()

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-heading">{t('transactions.title')}</h1>
          <p className="text-sm text-caption">{t('transactions.subtitle')}</p>
        </div>
        {!isGuest && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setShowCSVImport(true); setShowForm(false) }} size="lg" className="gap-2">
              <Upload size={12} />
              {t('transactions.csvImport')}
            </Button>
            <Button onClick={() => { setShowForm(true); setShowCSVImport(false) }} size="lg" className="gap-2">
              <Plus size={12} />
              {t('transactions.add')}
            </Button>
          </div>
        )}
      </div>

      {showForm && <TransactionForm />}
      {showCSVImport && <CSVImport onClose={() => setShowCSVImport(false)} />}

      <div className="flex flex-col gap-6">
        <div className="relative max-w-md">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('transactions.searchPlaceholder')}
            className="pl-10"
          />
        </div>
        <TransactionFilters />
      </div>

      <TransactionTable />
    </div>
  )
}
