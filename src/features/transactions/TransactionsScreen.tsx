import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTransactionsStore } from '@/stores/transactions'
import TransactionForm from './components/TransactionForm'
import TransactionFilters from './components/TransactionFilters'
import TransactionTable from './components/TransactionTable'
import { Plus, Search } from 'lucide-react'

export default function TransactionsScreen() {
  const { t } = useTranslation()
  const { showForm, setShowForm } = useTransactionsStore()
  const [search, setSearch] = useState('')

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-heading">{t('transactions.title')}</h1>
          <p className="text-sm text-caption">{t('transactions.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex cursor-pointer items-center gap-2 rounded bg-btn px-5 py-[10px] text-sm font-semibold text-on-btn transition-colors hover:bg-btn-hover"
        >
          <Plus size={12} />
          {t('transactions.add')}
        </button>
      </div>

      {showForm && <TransactionForm />}

      <div className="flex flex-col gap-6">
        <div className="relative max-w-[448px]">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('transactions.searchPlaceholder')}
            className="w-full rounded border border-edge bg-panel py-3 pl-10 pr-4 text-sm text-body outline-none placeholder:text-dim focus:border-edge-strong"
          />
        </div>
        <TransactionFilters />
      </div>

      <TransactionTable search={search} />
    </div>
  )
}
