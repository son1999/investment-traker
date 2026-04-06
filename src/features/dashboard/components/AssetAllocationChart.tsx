import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const allocationData = [
  { label: 'Vàng', value: 50, color: '#f59e0b' },
  { label: 'Crypto', value: 30, color: '#f97316' },
  { label: 'Cổ phiếu', value: 20, color: '#60a5fa' },
]

export default function AssetAllocationChart() {
  const data = {
    labels: allocationData.map((d) => d.label),
    datasets: [
      {
        data: allocationData.map((d) => d.value),
        backgroundColor: allocationData.map((d) => d.color),
        borderColor: 'var(--panel-alt)',
        borderWidth: 3,
        hoverBorderColor: 'var(--panel-alt)',
        hoverOffset: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'var(--field)',
        titleColor: 'var(--body)',
        bodyColor: 'var(--caption)',
        borderColor: 'var(--edge-strong)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: 600 as const, size: 13 },
        bodyFont: { family: 'JetBrains Mono', size: 13 },
        callbacks: {
          label: (ctx: { parsed: number }) => ` ${ctx.parsed}%`,
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 800,
    },
  }

  return (
    <div className="flex flex-col gap-8 rounded-lg border border-edge bg-panel p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-base font-bold text-body">Phân bổ tài sản</h3>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="6.5" stroke="var(--caption)" strokeWidth="1" />
          <path d="M7.5 6.5v4M7.5 4.5v1" stroke="var(--caption)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Chart */}
      <div className="flex flex-col items-center">
        <div className="relative h-[192px] w-[192px]">
          <Doughnut data={data} options={options} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.55px] text-caption">
              Tổng cộng
            </span>
            <span className="font-['JetBrains_Mono'] text-lg font-bold text-body">100%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid w-full grid-cols-3 gap-6">
          {allocationData.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="size-[10px] shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col">
                <span className="text-xs text-caption">{item.label}</span>
                <span className="font-['JetBrains_Mono'] text-sm font-bold text-body">
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
