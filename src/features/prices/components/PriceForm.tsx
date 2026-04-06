import { useState } from 'react'
import { usePricesStore } from '@/stores/prices'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const typeIcons: Record<string, string> = {
  Vàng: '✨',
  Crypto: '₿',
  'Cổ phiếu': '📈',
  'Kim loại': '✨',
}

export default function PriceForm() {
  const { addPrice } = usePricesStore()
  const [assetType, setAssetType] = useState('Vàng')
  const [assetCode, setAssetCode] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = () => {
    const p = parseFloat(price) || 0
    if (!assetCode || p <= 0) return

    addPrice({
      code: assetCode.toUpperCase(),
      icon: typeIcons[assetType] || '💰',
      type: assetType,
      price: p,
      updatedAt: new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })

    setAssetCode('')
    setPrice('')
  }

  return (
    <div className="rounded-lg border border-edge bg-panel p-8 shadow-sm">
      <h2 className="mb-8 text-lg font-semibold text-heading">Nhập giá mới</h2>

      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
            Loại tài sản
          </label>
          <Select value={assetType} onValueChange={setAssetType}>
            <SelectTrigger className="h-11 w-full rounded border-none bg-field px-4 text-sm text-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-edge-strong bg-panel-alt text-body">
              <SelectItem value="Vàng">Vàng</SelectItem>
              <SelectItem value="Crypto">Crypto</SelectItem>
              <SelectItem value="Cổ phiếu">Cổ phiếu</SelectItem>
              <SelectItem value="Kim loại">Kim loại</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
            Mã tài sản
          </label>
          <Input
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
            placeholder="Vd: BTC, PNJ"
            className="h-11 rounded border-none bg-field px-4 text-sm text-body placeholder:text-dim"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">
            Giá hiện tại (₫)
          </label>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="h-11 rounded border-none bg-field px-4 font-['JetBrains_Mono'] text-sm text-body placeholder:text-dim"
          />
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={handleSubmit}
            className="h-11 cursor-pointer rounded bg-btn text-base font-semibold text-on-btn transition-colors hover:bg-btn-hover"
          >
            Cập nhật giá
          </button>
        </div>
      </div>
    </div>
  )
}
