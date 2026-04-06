import { useState } from 'react'
import { useSettingsStore } from '@/stores/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AssetCategories() {
  const { categories, addCategory, removeCategory } = useSettingsStore()
  const [showForm, setShowForm] = useState(true)
  const [icon, setIcon] = useState('💰')
  const [color, setColor] = useState('#FFB148')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const handleSave = () => {
    if (!name || !code) return
    addCategory({ icon, name, code, color })
    setIcon('💰')
    setColor('#FFB148')
    setName('')
    setCode('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[3px]">
          <h2 className="text-sm font-semibold text-heading">Danh mục tài sản</h2>
          <p className="text-[13px] text-caption">
            Quản lý các loại tài sản đang theo dõi
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="h-auto gap-[6px] rounded bg-btn px-3 py-[6px] text-xs font-bold text-on-btn hover:bg-btn-hover"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M4.5 0.5v8M0.5 4.5h8" stroke="var(--on-btn)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Thêm loại tài sản
        </Button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="flex flex-col gap-4 rounded border border-dim bg-panel p-[17px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-caption">
                Icon / Emoji
              </span>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="border-none bg-field text-sm text-body"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-caption">
                Màu sắc
              </span>
              <div className="flex gap-2">
                <div className="flex h-9 w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-sm px-[2px]">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-7 w-full cursor-pointer border border-[#777]"
                  />
                </div>
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="border-none bg-field text-sm uppercase text-body"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-caption">
                Tên hiển thị
              </span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Chứng khoán"
                className="border-none bg-field text-sm text-body placeholder:text-dim"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.55px] text-caption">
                Mã Code
              </span>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="STOCKS"
                className="border-none bg-field text-sm text-body placeholder:text-dim"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="cursor-pointer bg-transparent px-4 py-2 text-xs font-medium text-caption hover:text-white"
            >
              Hủy
            </button>
            <Button
              onClick={handleSave}
              className="h-auto rounded bg-btn px-4 py-2 text-xs font-bold text-on-btn hover:bg-btn-hover"
            >
              Lưu danh mục
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex border-b border-dim pb-3">
          <span className="flex-1 text-[11px] font-bold uppercase tracking-[0.55px] text-caption">
            Loại
          </span>
          <span className="w-[138px] text-[11px] font-bold uppercase tracking-[0.55px] text-caption">
            Mã
          </span>
          <span className="w-[76px] text-[11px] font-bold uppercase tracking-[0.55px] text-caption">
            Màu
          </span>
          <span className="w-14" />
        </div>
        {/* Rows */}
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`flex items-center py-[18px] ${
              idx > 0 ? 'border-t border-edge-subtle' : ''
            }`}
          >
            <div className="flex flex-1 items-center gap-3">
              <span className="text-xl">{cat.icon}</span>
              <span className="text-sm font-medium text-body">{cat.name}</span>
            </div>
            <div className="w-[138px]">
              <span className="rounded-sm bg-field px-2 py-1 font-['JetBrains_Mono'] text-xs text-caption">
                {cat.code}
              </span>
            </div>
            <div className="w-[76px]">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
            </div>
            <div className="flex w-14 justify-end">
              <button
                onClick={() => removeCategory(cat.id)}
                className="cursor-pointer bg-transparent text-caption hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M10 4L7.5 7.5 10 11M4 4l2.5 3.5L4 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
