export default function CloudConnection() {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-5">
      <div className="flex flex-col gap-[3px]">
        <h2 className="text-sm font-semibold text-heading">Kết nối</h2>
        <p className="text-[13px] text-caption">Trạng thái Supabase</p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between rounded bg-panel px-[14px] py-[10px]">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-positive shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <span className="text-xs font-medium text-label">Đã kết nối</span>
        </div>
        <span className="font-['JetBrains_Mono'] text-xs text-label opacity-80">
          156 giao dịch · 8 giá
        </span>
      </div>

      {/* Disconnect button */}
      <button className="flex w-fit cursor-pointer items-center gap-2 rounded border border-edge bg-transparent px-[17px] py-[9px] text-sm font-medium text-label transition-colors hover:border-edge-strong">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <path d="M6 4H4a2 2 0 00-2 2v7a2 2 0 002 2h9a2 2 0 002-2v-7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M8.5 1v7M6 3.5L8.5 1 11 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Ngắt kết nối
      </button>
    </div>
  )
}
