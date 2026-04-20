import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search, Upload } from 'lucide-react'

import { PageHeader } from '@/components/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsGuest } from '@/hooks/useIsGuest'
import { useTransactionsUIStore } from '@/stores/transactions'

import CSVImport from './components/CSVImport'
import TransactionFilters from './components/TransactionFilters'
import TransactionForm from './components/TransactionForm'
import TransactionTable from './components/TransactionTable'

export default function TransactionsScreen() {
  const { t } = useTranslation()
  const { showForm, setShowForm, search, setSearch, editingTx } = useTransactionsUIStore()
  const [showCSVImport, setShowCSVImport] = useState(false)
  const isGuest = useIsGuest()

  return (
    <div className="air-page">
      <PageHeader
        title={t('transactions.title')}
        description={t('transactions.subtitle')}
        actions={
          !isGuest ? (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setShowCSVImport(true)
                  setShowForm(false)
                }}
                className="gap-2"
              >
                <Upload size={12} />
                {t('transactions.csvImport')}
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  setShowForm(true)
                  setShowCSVImport(false)
                }}
                className="gap-2"
              >
                <Plus size={12} />
                {t('transactions.add')}
              </Button>
            </>
          ) : undefined
        }
      />

      {showForm && <TransactionForm key={editingTx?.id || 'new'} />}
      {showCSVImport && <CSVImport onClose={() => setShowCSVImport(false)} />}

      <div className="air-surface flex min-w-0 flex-col gap-6 px-5 py-5 sm:px-6">
        <div className="relative w-full max-w-md">
          <Search
            size={17}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
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
