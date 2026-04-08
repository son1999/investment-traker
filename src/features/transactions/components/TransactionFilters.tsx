import { useTranslation } from 'react-i18next'
import { useTransactionsStore } from '@/stores/transactions'

export default function TransactionFilters() {
  const { t } = useTranslation()
  const { filter, setFilter } = useTransactionsStore()

  const filters = [t('transactions.all'), t('common.metal'), t('common.bitcoin'), t('common.stock')]

  return (
    <div className="flex items-center gap-2">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`cursor-pointer rounded-xl px-4 py-1.5 text-xs font-medium transition-colors ${
            filter === f
              ? 'bg-btn text-on-btn'
              : 'bg-panel-alt text-caption hover:text-body'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
