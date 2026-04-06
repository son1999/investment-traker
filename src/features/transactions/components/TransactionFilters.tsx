import { useTransactionsStore } from '@/stores/transactions'

const filters = ['Tất cả', 'Vàng', 'Bitcoin', 'Cổ phiếu']

export default function TransactionFilters() {
  const { filter, setFilter } = useTransactionsStore()

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
