import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Plus, MoreVertical, ExternalLink } from 'lucide-react'

export default function AssetDetailScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const metrics = [
    {
      label: t('assetDetail.holdings'),
      value: '0.5',
      unit: 'BTC',
      sub: '3 lệnh mua · 1 lệnh bán',
      border: '#454747',
    },
    {
      label: t('assetDetail.avgCost'),
      value: '850.000.000',
      unit: '₫',
      sub: t('assetDetail.totalCostLabel') + ': 425.000.000 ₫',
      border: '#454747',
    },
    {
      label: t('assetDetail.currentPrice'),
      value: '1.650.000.000',
      unit: '₫',
      sub: 'Cập nhật: 03/04/2025 14:30',
      border: '#f8a010',
      hasRefresh: true,
    },
    {
      label: t('assetDetail.profit'),
      value: '+400.000.000',
      unit: '₫',
      sub: '+94.12%',
      border: '#22c55e',
      isProfit: true,
    },
  ]

  const txRows = [
    { date: '15/03/2025', type: t('common.sell'), qty: '0.1', price: '1.350.000.000', total: '135.000.000', note: 'Chốt lời ngắn hạn' },
    { date: '10/01/2025', type: t('common.buy'), qty: '0.2', price: '900.000.000', total: '180.000.000', note: '' },
    { date: '05/11/2024', type: t('common.buy'), qty: '0.2', price: '850.000.000', total: '170.000.000', note: 'DCA đợt 2' },
    { date: '12/08/2024', type: t('common.buy'), qty: '0.2', price: '750.000.000', total: '150.000.000', note: 'Mở vị thế mới' },
  ]

  const chartLabels = ['01/2025', '02/2025', '03/2025', 'Hiện tại']

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-6">
      {/* Back bar */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-2 bg-transparent text-sm font-medium text-caption transition-colors hover:text-heading"
          >
            <ArrowLeft size={13} />
            {t('assetDetail.back')}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="cursor-pointer rounded border border-edge bg-transparent px-4 py-2 text-sm font-medium text-body transition-colors hover:border-edge-strong">
            {t('assetDetail.updatePrice')}
          </button>
          <button className="flex cursor-pointer items-center gap-2 rounded bg-btn px-4 py-2 text-sm font-bold text-on-btn transition-colors hover:bg-btn-hover">
            <Plus size={11} />
            {t('assetDetail.addTransaction')}
          </button>
          <button className="cursor-pointer bg-transparent text-caption hover:text-heading">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* Asset Header */}
        <div className="flex items-center gap-5">
          <div className="flex size-14 items-center justify-center rounded-lg bg-field shadow-[0px_8px_32px_0px_rgba(231,228,236,0.04)]">
            <span className="text-[30px] text-body">₿</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-[-1.5px] text-heading">BTC</h1>
              <span className="rounded-xl border border-edge-strong px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
                {t('common.bitcoin')}
              </span>
            </div>
            <p className="text-sm tracking-[0.35px] text-caption">
              {t('assetDetail.assetDescription')}
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col gap-2 rounded-lg bg-panel py-6 pl-[26px] pr-6"
              style={{ borderLeft: `2px solid ${m.border}` }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
                {m.label}
              </span>
              <div className="flex items-baseline gap-1 pt-1">
                <span
                  className={`font-['JetBrains_Mono'] text-xl font-semibold ${m.isProfit ? 'text-positive' : 'text-heading'}`}
                >
                  {m.value}
                </span>
                <span
                  className={`font-['JetBrains_Mono'] text-sm ${m.isProfit ? 'text-[rgba(34,197,94,0.7)]' : 'text-caption'}`}
                >
                  {m.unit}
                </span>
                {m.hasRefresh && (
                  <ExternalLink size={9} className="ml-1 text-caption" />
                )}
              </div>
              {m.isProfit ? (
                <span className="inline-flex w-fit rounded-sm bg-positive/10 px-2 py-0.5 text-[10px] font-bold text-positive">
                  {m.sub}
                </span>
              ) : (
                <span className="text-xs text-[rgba(172,170,177,0.7)]">{m.sub}</span>
              )}
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="rounded-2xl bg-panel p-8 shadow-[0px_8px_32px_0px_rgba(231,228,236,0.04)]">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-heading">{t('assetDetail.valueChart')}</h2>
              <p className="text-sm text-caption">
                {t('assetDetail.valueChartDesc')}
              </p>
            </div>
            <div className="flex gap-2">
              {[t('assetDetail.periodMonth'), t('assetDetail.periodYear'), t('assetDetail.periodAll')].map((period, i) => (
                <button
                  key={period}
                  className={`cursor-pointer rounded-sm px-3 py-1 text-[11px] font-bold ${
                    i === 0 ? 'bg-field text-body' : 'bg-transparent text-caption'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Mock chart area */}
          <div className="relative h-80">
            {/* Grid lines */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-body opacity-10"
                style={{ top: `${8 + i * (304 / 3)}px` }}
              />
            ))}

            {/* Mock line chart using SVG */}
            <svg
              className="absolute left-0 top-6 h-[264px] w-full"
              viewBox="0 0 1120 264"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8a010" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f8a010" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 220 L120 180 L250 190 L380 140 L500 110 L620 90 L720 80 L820 60 L920 50 L1020 40 L1120 30"
                stroke="#f8a010"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M0 220 L120 180 L250 190 L380 140 L500 110 L620 90 L720 80 L820 60 L920 50 L1020 40 L1120 30 L1120 264 L0 264 Z"
                fill="url(#chartGrad)"
              />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
              {chartLabels.map((l) => (
                <span
                  key={l}
                  className="font-['JetBrains_Mono'] text-[10px] uppercase text-caption"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* P&L Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Realized */}
          <div
            className="flex flex-col gap-6 rounded-lg bg-panel py-6 pl-[26px] pr-6"
            style={{ borderLeft: '2px solid rgba(34,197,94,0.3)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[1.4px] text-caption">
                {t('assetDetail.realizedPnl')}
              </h3>
              <span className="font-['JetBrains_Mono'] text-lg font-bold text-positive">
                +50.000.000 ₫
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-edge-subtle">
                  <th className="pb-3 text-left text-xs font-medium text-caption">{t('assetDetail.colDate')}</th>
                  <th className="pb-3 text-left text-xs font-medium text-caption">{t('assetDetail.colQty')}</th>
                  <th className="pb-3 text-right text-xs font-medium text-caption">{t('reports.profitLoss')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 text-xs text-[rgba(231,228,236,0.9)]">15/03/2025</td>
                  <td className="py-3 font-['JetBrains_Mono'] text-xs text-[rgba(231,228,236,0.9)]">
                    0.1 BTC
                  </td>
                  <td className="py-3 text-right font-['JetBrains_Mono'] text-xs text-positive">
                    +50.000.000 ₫
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Unrealized */}
          <div
            className="flex flex-col gap-6 rounded-lg bg-panel py-6 pl-[26px] pr-6"
            style={{ borderLeft: '2px solid rgba(248,160,16,0.3)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[1.4px] text-caption">
                {t('assetDetail.unrealizedPnl')}
              </h3>
              <span className="font-['JetBrains_Mono'] text-lg font-bold text-positive">
                +400.000.000 ₫
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-edge-subtle pb-2">
                <span className="text-xs text-caption">{t('assetDetail.currentValue')}</span>
                <span className="font-['JetBrains_Mono'] text-xs text-body">
                  825.000.000 ₫
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-edge-subtle pb-2">
                <span className="text-xs text-caption">{t('assetDetail.totalCost')}</span>
                <span className="font-['JetBrains_Mono'] text-xs text-body">
                  425.000.000 ₫
                </span>
              </div>
              <p className="pt-1 text-xs italic leading-5 text-caption opacity-80">
                Chi tiết: Đang giữ 0.5 đơn vị × Giá hiện tại 1.650.000.000 ₫ = 825.000.000 ₫.
                Giá vốn: 425.000.000 ₫ → Chênh lệch: +400.000.000 ₫
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-hidden rounded-2xl bg-panel-alt shadow-[0px_8px_32px_0px_rgba(231,228,236,0.04)]">
          <div className="px-8 py-6">
            <h2 className="text-lg font-bold text-heading">{t('assetDetail.transactionsOf', { code: 'BTC' })}</h2>
            <p className="text-xs text-caption">{t('assetDetail.transactionsCount', { count: 4 })}</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[rgba(37,37,43,0.4)]">
                {[t('assetDetail.colDate'), t('assetDetail.colType'), t('assetDetail.colQty'), t('assetDetail.colUnitPrice'), t('assetDetail.colTotal'), t('assetDetail.colNote'), t('assetDetail.colAction')].map(
                  (col, i) => (
                    <th
                      key={col}
                      className={`px-6 py-4 text-[11px] font-semibold uppercase tracking-[1.1px] text-caption ${
                        i === 0 ? 'pl-8' : ''
                      } ${i === 6 ? 'pr-8 text-right' : 'text-left'}`}
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {txRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${idx > 0 ? 'border-t border-edge-subtle' : ''} transition-colors hover:bg-[rgba(255,255,255,0.02)]`}
                >
                  <td className="py-[22px] pl-8 pr-6 font-['JetBrains_Mono'] text-sm text-body">
                    {row.date}
                  </td>
                  <td className="px-6 py-[22px]">
                    {row.type === t('common.buy') ? (
                      <span className="rounded-sm bg-positive/10 px-2 text-[10px] font-bold text-positive">
                        {t('common.buy')}
                      </span>
                    ) : (
                      <span className="rounded-sm bg-[rgba(127,41,39,0.2)] px-2 text-[10px] font-bold text-[#bb5551]">
                        {t('common.sell')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-[22px] font-['JetBrains_Mono'] text-sm text-body">
                    {row.qty}
                  </td>
                  <td className="px-6 py-[22px] font-['JetBrains_Mono'] text-sm text-body">
                    {row.price}
                  </td>
                  <td className="px-6 py-[22px] font-['JetBrains_Mono'] text-sm text-body">
                    {row.total}
                  </td>
                  <td className="px-6 py-[22px] text-sm italic text-caption">
                    {row.note || '—'}
                  </td>
                  <td className="py-[22px] pl-6 pr-8 text-right">
                    <button className="cursor-pointer bg-transparent text-caption transition-colors hover:text-heading">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M12.75 2.25l3 3M2.25 12.75l-0.75 3.75 3.75-0.75L14.25 6.75l-3-3L2.25 12.75z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
