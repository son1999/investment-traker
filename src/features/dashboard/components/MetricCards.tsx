const metrics = [
  {
    label: 'Tổng giá trị',
    value: '1.25 tỷ ₫',
    sub: '3 tài sản',
    color: '',
    accent: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="14" rx="2" stroke="var(--caption)" strokeWidth="1.5" />
        <path d="M5 8h6M8 5v6" stroke="var(--caption)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    gradient: true,
  },
  {
    label: 'Vốn đầu tư',
    value: '1.08 tỷ ₫',
    sub: '12 lệnh mua',
    color: '',
    accent: false,
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="8.5" r="7" stroke="var(--caption)" strokeWidth="1.5" />
        <path d="M8.5 4.5v4l3 3" stroke="var(--caption)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    gradient: false,
  },
  {
    label: 'Lợi nhuận',
    value: '+170 triệu ₫',
    sub: '+15.23% so với vốn',
    color: '#22c55e',
    accent: true,
    icon: (
      <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
        <path d="M1 9L6 4L10 7L16 1" stroke="var(--positive)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 1h5v5" stroke="var(--positive)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: false,
  },
]

export default function MetricCards() {
  return (
    <div className="grid w-full grid-cols-3 gap-6">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`relative overflow-hidden rounded-lg border border-edge bg-panel p-5 ${
            m.accent ? 'border-l-2 border-[rgba(34,197,94,0.3)]' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-caption">{m.label}</span>
              <span
                className="font-['JetBrains_Mono'] text-[26px] font-bold leading-[39px]"
                style={{ color: m.color || 'var(--body)' }}
              >
                {m.value}
              </span>
              <div className="mt-2 flex items-center gap-1">
                {m.accent && (
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className="shrink-0">
                    <path d="M1 6L6 1L11 6" stroke="var(--positive)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span
                  className="text-xs"
                  style={{ color: m.color || 'var(--caption)', fontWeight: m.accent ? 500 : 400 }}
                >
                  {m.sub}
                </span>
              </div>
            </div>
            <div
              className={`flex size-9 items-center justify-center rounded-sm ${
                m.accent ? 'bg-positive/10' : 'bg-field'
              }`}
            >
              {m.icon}
            </div>
          </div>
          {m.gradient && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgba(198,198,199,0.2)] to-transparent" />
          )}
        </div>
      ))}
    </div>
  )
}
