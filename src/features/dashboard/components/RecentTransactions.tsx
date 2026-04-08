import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRecentTransactions } from '@/hooks/useTransactions'

export default function RecentTransactions() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: transactions } = useRecentTransactions()

  const items = transactions || []

  return (
    <div className="w-full overflow-hidden rounded-lg border border-edge bg-panel pb-1">
      <div className="flex items-center justify-between border-b border-edge-subtle px-8 py-6">
        <h3 className="text-base font-bold text-body">{t('dashboard.recentTransactions')}</h3>
        <button onClick={() => navigate('/transactions')} className="cursor-pointer bg-transparent text-[13px] font-medium text-label hover:underline">{t('dashboard.allTransactions')}</button>
      </div>
      <div className="flex flex-col">
        {items.map((tx) => {
          const isBuy = tx.action === 'MUA'
          const dateStr = new Date(tx.date).toLocaleDateString('vi-VN')
          return (
            <div key={tx.id} className="flex items-center justify-between rounded px-8 py-3 transition-colors hover:bg-[rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-4">
                <span className="w-24 font-['JetBrains_Mono'] text-xs text-caption">{dateStr}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tx.icon}</span>
                  <span className="text-sm font-bold uppercase text-body">{tx.assetCode}</span>
                </div>
                <span className={`rounded-sm px-2 py-[2px] text-[10px] font-bold ${isBuy ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
                  {isBuy ? t('common.buy') : t('common.sell')}
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-sm font-bold text-body">{tx.quantity} {tx.assetCode}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
