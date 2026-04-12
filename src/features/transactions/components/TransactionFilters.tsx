import { useTranslation } from 'react-i18next'
import { useTransactionsUIStore } from '@/stores/transactions'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TransactionFilters() {
  const { t } = useTranslation()
  const { filter, setFilter } = useTransactionsUIStore()

  const filters = [
    { value: '', label: t('transactions.all') },
    { value: 'metal', label: t('common.metal') },
    { value: 'crypto', label: t('common.crypto') },
    { value: 'stock', label: t('common.stock') },
    { value: 'savings', label: t('common.savings') },
  ]

  return (
    <Tabs value={filter} onValueChange={setFilter}>
      <TabsList className="h-auto flex-wrap">
        {filters.map((f) => (
          <TabsTrigger key={f.value} value={f.value}>{f.label}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
