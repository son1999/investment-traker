import { useTranslation } from 'react-i18next'
import { useTransactionsStore } from '@/stores/transactions'
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Check,
} from 'lucide-react'

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' ₫'
}

export default function TransactionTable({ search }: { search: string }) {
  const { t } = useTranslation()
  const {
    transactions,
    filter,
    selectedIds,
    removeTransaction,
    toggleSelect,
    selectAll,
    deselectAll,
    removeSelected,
  } = useTransactionsStore()

  const filtered = transactions
    .filter((transaction) => (filter === t('transactions.all') ? true : transaction.assetType === filter))
    .filter((transaction) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        transaction.assetCode.toLowerCase().includes(q) ||
        transaction.note.toLowerCase().includes(q)
      )
    })

  const allSelected = filtered.length > 0 && filtered.every((tx) => selectedIds.includes(tx.id))

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll()
    } else {
      selectAll(filtered.map((tx) => tx.id))
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-edge-subtle bg-panel">
        <table className="w-full">
          <thead>
            <tr className="border-b border-edge bg-panel-alt">
              {/* Checkbox */}
              <th className="w-16 px-6 py-4">
                <Checkbox checked={allSelected} onChange={handleSelectAll} />
              </th>
              <th className="py-4 pl-6 text-left">
                <button className="flex cursor-pointer items-center gap-1 bg-transparent text-[11px] font-medium uppercase tracking-[1.1px] text-caption">
                  {t('assetDetail.colDate')}
                  <ChevronDown size={10} />
                </button>
              </th>
              <th className="py-4 pl-12 text-left">
                <button className="flex cursor-pointer items-center gap-1 bg-transparent text-[11px] font-medium uppercase tracking-[1.1px] text-caption">
                  {t('dashboard.colAsset')}
                  <ChevronDown size={10} />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[1.1px] text-caption">
                {t('dashboard.colType')}
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[1.1px] text-caption">
                {t('dashboard.colQty')}
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[1.1px] text-caption">
                {t('assetDetail.colUnitPrice')}
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[1.1px] text-caption">
                {t('transactions.total')}
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[1.1px] text-caption">
                {t('transactions.note')}
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[1.1px] text-caption">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, idx) => {
              const isSelected = selectedIds.includes(tx.id)
              return (
                <tr
                  key={tx.id}
                  className={`${idx > 0 ? 'border-t border-edge-subtle' : ''} transition-colors hover:bg-[rgba(255,255,255,0.02)]`}
                >
                  <td className="w-16 px-6 py-6">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelect(tx.id)}
                    />
                  </td>
                  <td className="px-6 py-[22px] font-['JetBrains_Mono'] text-sm text-caption">
                    {tx.date}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex size-6 items-center justify-center rounded-full text-[10px]"
                        style={{ backgroundColor: tx.iconBg }}
                      >
                        {tx.icon}
                      </div>
                      <span className="text-base font-semibold text-heading">
                        {tx.assetCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {tx.action === 'MUA' ? (
                      <span className="rounded-sm bg-[#1e3a2a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[-0.5px] text-[#4ade80]">
                        {t('common.buy')}
                      </span>
                    ) : (
                      <span className="rounded-sm bg-[rgba(127,41,39,0.2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[-0.5px] text-negative">
                        {t('common.sell')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-[22px] text-right font-['JetBrains_Mono'] text-sm text-body">
                    {tx.quantity.toLocaleString('en-US')}
                  </td>
                  <td className="px-6 py-[22px] text-right font-['JetBrains_Mono'] text-sm text-body">
                    {formatVND(tx.unitPrice)}
                  </td>
                  <td className="px-6 py-[22px] text-right font-['JetBrains_Mono'] text-sm font-bold text-heading">
                    {formatVND(tx.quantity * tx.unitPrice)}
                  </td>
                  <td className="px-6 py-[22px] text-sm text-caption">
                    {tx.note || '—'}
                  </td>
                  <td className="px-6 py-[22px]">
                    <div className="flex items-center justify-center gap-3">
                      <button className="cursor-pointer bg-transparent text-caption transition-colors hover:text-heading">
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => removeTransaction(tx.id)}
                        className="cursor-pointer bg-transparent text-caption transition-colors hover:text-negative"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Enhanced pagination footer */}
        <div className="flex items-center justify-between border-t border-edge-subtle bg-panel-alt px-6 py-6">
          <span className="text-sm text-caption">
            {t('transactions.showing')}{' '}
            <span className="font-medium text-heading">1-{filtered.length}</span>
            {t('transactions.of')}
            <span className="font-medium text-heading">{transactions.length}</span>
            {' giao dịch'}
          </span>
          <div className="flex items-center gap-2">
            <button className="cursor-pointer rounded-sm border border-edge bg-transparent p-2.5 text-caption opacity-30">
              <ChevronsLeft size={8} />
            </button>
            <button className="cursor-pointer rounded-sm border border-edge bg-transparent p-2.5 text-caption opacity-30">
              <ChevronLeft size={8} />
            </button>
            <div className="flex gap-1 px-2">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`flex size-8 cursor-pointer items-center justify-center rounded-sm text-sm ${
                    p === 1
                      ? 'bg-btn font-bold text-on-btn'
                      : 'bg-transparent font-medium text-caption'
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="flex size-8 items-center justify-center text-base text-dim">
                ...
              </span>
              <button className="flex size-8 cursor-pointer items-center justify-center rounded-sm bg-transparent text-sm font-medium text-caption">
                8
              </button>
            </div>
            <button className="cursor-pointer rounded-sm border border-edge bg-transparent p-2.5 text-caption transition-colors hover:text-heading">
              <ChevronRight size={8} />
            </button>
            <button className="cursor-pointer rounded-sm border border-edge bg-transparent p-2.5 text-caption transition-colors hover:text-heading">
              <ChevronsRight size={8} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-xl border border-edge-strong bg-field px-6 py-3.5 shadow-[0px_8px_30px_0px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-btn" />
            <span className="text-sm font-semibold text-heading">
              {t('transactions.selected', { count: selectedIds.length })}
            </span>
          </div>
          <div className="h-4 w-px bg-[rgba(71,71,78,0.3)]" />
          <div className="flex items-center gap-3">
            <button
              onClick={removeSelected}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-negative/10 px-4 py-1.5 text-sm font-bold text-negative transition-colors hover:bg-[rgba(238,125,119,0.2)]"
            >
              <Trash2 size={10} />
              {t('transactions.delete')}
            </button>
            <button
              onClick={deselectAll}
              className="cursor-pointer rounded-xl border border-edge-strong bg-transparent px-4 py-1.5 text-sm font-bold text-heading transition-colors hover:border-edge-strong"
            >
              {t('transactions.deselect')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className={`flex size-4 cursor-pointer items-center justify-center rounded-sm border ${
        checked
          ? 'border-transparent bg-btn'
          : 'border-edge-strong bg-field'
      }`}
    >
      {checked && <Check size={12} className="text-on-btn" strokeWidth={3} />}
    </button>
  )
}
