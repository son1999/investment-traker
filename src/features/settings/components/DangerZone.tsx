export default function DangerZone() {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-negative/20 bg-negative/5 p-[25px]">
      <div className="flex flex-col gap-[3px]">
        <h2 className="text-sm font-semibold text-negative">Vùng nguy hiểm</h2>
        <p className="text-[13px] text-caption opacity-70">
          Hành động không thể hoàn tác
        </p>
      </div>
      <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-[#7f1d1d] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#991b1b]">
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
          <path d="M1 3.5h11M4.5 3.5V2a1 1 0 011-1h2a1 1 0 011 1v1.5M10 3.5v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 6v4M7.5 6v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Xóa toàn bộ dữ liệu
      </button>
    </div>
  )
}
