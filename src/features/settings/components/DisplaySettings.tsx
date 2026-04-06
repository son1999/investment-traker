import { useSettingsStore } from '@/stores/settings'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DisplaySettings() {
  const {
    showAmount,
    compactNumbers,
    currency,
    weekStart,
    toggleShowAmount,
    toggleCompactNumbers,
    setCurrency,
    setWeekStart,
  } = useSettingsStore()

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-edge bg-panel p-5">
      <div className="flex flex-col gap-[3px]">
        <h2 className="text-sm font-semibold text-heading">Tùy chỉnh hiển thị</h2>
        <p className="text-[13px] text-caption">
          Điều chỉnh giao diện người dùng theo sở thích
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Show amount toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-body">Hiện số tiền</span>
          <Switch
            checked={showAmount}
            onCheckedChange={toggleShowAmount}
            className="data-[state=checked]:bg-btn data-[state=unchecked]:bg-field"
          />
        </div>

        {/* Compact numbers toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-body">Format số rút gọn</span>
          <Switch
            checked={compactNumbers}
            onCheckedChange={toggleCompactNumbers}
            className="data-[state=checked]:bg-btn data-[state=unchecked]:bg-field"
          />
        </div>

        {/* Currency select */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-body">Tiền tệ mặc định</span>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-8 w-[120px] border-none bg-panel text-sm text-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-edge-strong bg-panel-alt text-body">
              <SelectItem value="VND">VND (₫)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Week start select */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-body">Ngày bắt đầu tuần</span>
          <Select value={weekStart} onValueChange={setWeekStart}>
            <SelectTrigger className="h-8 w-[120px] border-none bg-panel text-sm text-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-edge-strong bg-panel-alt text-body">
              <SelectItem value="mon">Thứ 2</SelectItem>
              <SelectItem value="sun">Chủ nhật</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
