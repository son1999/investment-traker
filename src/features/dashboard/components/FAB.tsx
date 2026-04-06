export default function FAB() {
  return (
    <button className="fixed bottom-8 right-8 z-50 flex size-14 cursor-pointer items-center justify-center rounded-xl bg-btn text-on-btn transition-colors hover:bg-btn-hover active:scale-95">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}
