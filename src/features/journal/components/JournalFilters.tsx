import { useJournalStore } from '@/stores/journal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const sentimentOptions = ['Tất cả', 'Lạc quan', 'Lo ngại', 'Trung lập']
const assetOptions = ['Tất cả', 'BTC', 'ETH', 'SJC', 'VNM', 'Vàng nhẫn']

export default function JournalFilters({ count }: { count: number }) {
  const { sentimentFilter, assetFilter, setSentimentFilter, setAssetFilter } =
    useJournalStore()

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-4">
        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="h-9 w-48 rounded border-none bg-panel text-xs text-label">
            <SelectValue>Tâm lý: {sentimentFilter}</SelectValue>
          </SelectTrigger>
          <SelectContent className="border-edge-strong bg-panel-alt text-body">
            {sentimentOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={assetFilter} onValueChange={setAssetFilter}>
          <SelectTrigger className="h-9 w-48 rounded border-none bg-panel text-xs text-label">
            <SelectValue>Tài sản: {assetFilter}</SelectValue>
          </SelectTrigger>
          <SelectContent className="border-edge-strong bg-panel-alt text-body">
            {assetOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.6px] text-dim">
        Hiển thị {count} ghi chép
      </span>
    </div>
  )
}
