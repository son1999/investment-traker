import { useState } from 'react'
import { useJournalStore, type Sentiment } from '@/stores/journal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X } from 'lucide-react'

const sentimentOptions: { value: Sentiment; label: string }[] = [
  { value: 'optimistic', label: '😀 Lạc quan' },
  { value: 'worried', label: '😟 Lo ngại' },
  { value: 'neutral', label: '😐 Trung lập' },
]

export default function JournalForm() {
  const { addEntry, setShowForm } = useJournalStore()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [sentiment, setSentiment] = useState<Sentiment>('optimistic')
  const [assets, setAssets] = useState<string[]>([])
  const [assetInput, setAssetInput] = useState('')
  const [date, setDate] = useState('')

  const handleAddAsset = () => {
    const code = assetInput.trim().toUpperCase()
    if (code && !assets.includes(code)) {
      setAssets([...assets, code])
      setAssetInput('')
    }
  }

  const handleRemoveAsset = (code: string) => {
    setAssets(assets.filter((a) => a !== code))
  }

  const handleAssetKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddAsset()
    }
  }

  const handleSave = () => {
    if (!title.trim()) return
    addEntry({
      title: title.trim(),
      content: content.trim(),
      sentiment,
      assets,
      date: date || new Date().toISOString().split('T')[0],
    })
    setTitle('')
    setContent('')
    setSentiment('optimistic')
    setAssets([])
    setDate('')
  }

  return (
    <div className="overflow-hidden rounded-lg border border-edge bg-panel">
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold leading-7 text-heading">
            Ghi chép mới
          </h2>
          <p className="text-xs text-label">
            Lưu lại phân tích và tâm lý giao dịch của bạn.
          </p>
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column */}
          <div className="col-span-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-label">
                Tiêu đề
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quyết định mua thêm BTC"
                className="h-11 w-full rounded bg-field px-3 text-sm text-heading outline-none placeholder:text-dim"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-label">
                Nội dung
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Phân tích thị trường, lý do mua/bán..."
                className="h-[120px] w-full resize-none rounded bg-field p-3 text-sm leading-5 text-heading outline-none placeholder:text-dim"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-label">
                Tâm lý thị trường
              </label>
              <Select value={sentiment} onValueChange={(v) => setSentiment(v as Sentiment)}>
                <SelectTrigger className="h-11 w-full rounded border-none bg-field text-sm text-heading">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-edge-strong bg-panel-alt text-body">
                  {sentimentOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-label">
                Tài sản liên quan
              </label>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {assets.map((code) => (
                  <button
                    key={code}
                    onClick={() => handleRemoveAsset(code)}
                    className="flex cursor-pointer items-center gap-1 rounded-xl border border-gold/30 bg-gold/20 px-3 py-1 text-xs font-medium text-gold"
                  >
                    {code}
                    <X size={10} />
                  </button>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={assetInput}
                    onChange={(e) => setAssetInput(e.target.value)}
                    onKeyDown={handleAssetKeyDown}
                    placeholder="Thêm..."
                    className="w-16 bg-transparent text-xs text-label outline-none placeholder:text-dim"
                  />
                  <button
                    onClick={handleAddAsset}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-xl bg-field text-label hover:text-heading"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.55px] text-label">
                Ngày ghi chép
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 w-full rounded bg-field px-3 text-sm text-heading outline-none "
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setShowForm(false)}
            className="cursor-pointer rounded border border-edge bg-transparent px-[25px] py-[11px] text-sm font-semibold text-label transition-colors hover:bg-edge-subtle"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer rounded bg-btn px-8 py-[10.5px] text-sm font-semibold text-on-btn transition-colors hover:bg-btn-hover"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
