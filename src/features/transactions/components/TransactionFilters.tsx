import { useTranslation } from 'react-i18next'
import { useTransactionsUIStore } from '@/stores/transactions'

export default function TransactionFilters() {
  const { t } = useTranslation()
  const { filter, setFilter } = useTransactionsUIStore()

  const filters = [
    { value: '', label: t('transactions.all') },
    { value: 'metal', label: t('common.metal') },
    { value: 'crypto', label: t('common.crypto') },
    { value: 'stock', label: t('common.stock') },
  ]

  return (
    <div className="flex items-center gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`cursor-pointer rounded-xl px-4 py-1.5 text-xs font-medium transition-colors ${
            filter === f.value ? 'bg-btn text-on-btn' : 'bg-panel-alt text-caption hover:text-body'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
