import { useState, useMemo } from 'react'
import { useTransactionsStore } from '@/stores/transactions'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const assetTypeIcons: Record<string, { icon: string; iconBg: string }> = {
  Vàng: { icon: '🥇', iconBg: 'rgba(248,160,16,0.2)' },
  Bitcoin: { icon: '₿', iconBg: '#3b3b3e' },
  'Cổ phiếu': { icon: '📈', iconBg: '#3b3b3e' },
}

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' ₫'
}

export default function TransactionForm() {
  const { addTransaction, setShowForm } = useTransactionsStore()

  const [assetType, setAssetType] = useState('Vàng')
  const [assetCode, setAssetCode] = useState('')
  const [action, setAction] = useState('MUA')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const total = useMemo(() => {
    const qty = parseFloat(quantity) || 0
    const price = parseFloat(unitPrice) || 0
    return qty * price
  }, [quantity, unitPrice])

  const handleSave = () => {
    const qty = parseFloat(quantity) || 0
    const price = parseFloat(unitPrice) || 0
    if (!assetCode || qty <= 0 || price <= 0) return

    const icons = assetTypeIcons[assetType] || { icon: '💰', iconBg: '#3b3b3e' }

    addTransaction({
      date: date || new Date().toISOString().split('T')[0],
      assetType,
      assetCode: assetCode.toUpperCase(),
      action: action as 'MUA' | 'BÁN',
      quantity: qty,
      unitPrice: price,
      note,
      ...icons,
    })

    setAssetCode('')
    setQuantity('')
    setUnitPrice('')
    setDate('')
    setNote('')
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-edge-subtle bg-panel shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-6 p-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-heading">Giao dịch mới</h2>
          <p className="text-xs font-medium uppercase tracking-[0.6px] text-caption">
            Nhập thông tin mua hoặc bán
          </p>
        </div>

        {/* Row 1: Asset type, Asset code, Action */}
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.55px] text-caption">
              Loại tài sản
            </label>
            <Select value={assetType} onValueChange={setAssetType}>
              <SelectTrigger className="h-9 w-full rounded border-none bg-field text-sm text-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-edge-strong bg-panel-alt text-body">
                <SelectItem value="Vàng">Vàng</SelectItem>
                <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                <SelectItem value="Cổ phiếu">Cổ phiếu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.55px] text-caption">
              Mã tài sản
            </label>
            <Input
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              placeholder="SJC, BTC, VNM..."
              className="h-9 rounded border-none bg-field text-sm text-body placeholder:text-dim"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.55px] text-caption">
              Hành động
            </label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="h-9 w-full rounded border-none bg-field text-sm text-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-edge-strong bg-panel-alt text-body">
                <SelectItem value="MUA">MUA</SelectItem>
                <SelectItem value="BÁN">BÁN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Quantity, Unit price, Date */}
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.55px] text-caption">
              Số lượng
            </label>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="h-9 rounded border-none bg-field font-['JetBrains_Mono'] text-sm text-body placeholder:text-dim"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.55px] text-caption">
              Đơn giá (₫)
            </label>
            <Input
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="0"
              className="h-9 rounded border-none bg-field font-['JetBrains_Mono'] text-sm text-body placeholder:text-dim"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.55px] text-caption">
              Ngày
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 w-full rounded border-none bg-field px-3 text-sm text-body outline-none "
            />
          </div>
        </div>

        {/* Note */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-[0.55px] text-caption">
            Ghi chú
          </label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thêm mô tả cho giao dịch này..."
            className="h-9 rounded border-none bg-field text-sm text-body placeholder:text-dim"
          />
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded border border-edge-subtle bg-[rgba(31,31,36,0.5)] p-[17px]">
          <span className="text-sm text-caption">Tổng giá trị</span>
          <span className="font-['JetBrains_Mono'] text-xl font-bold text-heading">
            {formatVND(total)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={handleSave}
            className="cursor-pointer rounded bg-btn px-6 py-[10.5px] text-sm font-semibold text-on-btn transition-colors hover:bg-btn-hover"
          >
            Lưu giao dịch
          </button>
          <button
            onClick={handleCancel}
            className="cursor-pointer rounded border border-edge-strong bg-transparent px-[25px] py-[11px] text-sm font-semibold text-heading transition-colors hover:bg-edge-subtle"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}
