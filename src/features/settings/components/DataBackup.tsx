export default function DataBackup() {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-5">
      <div className="flex flex-col gap-[3px]">
        <h2 className="text-sm font-semibold text-heading">Sao lưu dữ liệu</h2>
        <p className="text-[13px] text-caption">Xuất hoặc nhập toàn bộ dữ liệu JSON</p>
      </div>
      <div className="flex gap-3">
        <button className="flex cursor-pointer items-center gap-2 rounded border border-edge bg-transparent px-[17px] py-[9px] text-sm font-medium text-label transition-colors hover:border-edge-strong">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v8M3 6l3.5 3L10 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 11h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Xuất JSON
        </button>
        <button className="flex cursor-pointer items-center gap-2 rounded border border-edge bg-transparent px-[17px] py-[9px] text-sm font-medium text-label transition-colors hover:border-edge-strong">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 9V1M3 4l3.5-3L10 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 11h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Nhập JSON
        </button>
      </div>
    </div>
  )
}
