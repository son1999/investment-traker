import { create } from 'zustand'

export type Sentiment = 'optimistic' | 'worried' | 'neutral'

export interface JournalEntry {
  id: string
  title: string
  content: string
  sentiment: Sentiment
  assets: string[]
  date: string
}

interface JournalState {
  entries: JournalEntry[]
  showForm: boolean
  sentimentFilter: string
  assetFilter: string
  setShowForm: (show: boolean) => void
  setSentimentFilter: (filter: string) => void
  setAssetFilter: (filter: string) => void
  addEntry: (data: Omit<JournalEntry, 'id'>) => void
  removeEntry: (id: string) => void
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [
    {
      id: '1',
      title: 'Phân bổ lại danh mục sau khi BTC phá đỉnh',
      content:
        'Sau khi Bitcoin chính thức vượt qua mức ATH cũ, tâm lý thị trường đang cực kỳ hưng phấn. Tôi quyết định chốt lời 10% danh mục Altcoins để chuyển sang stablecoin nhằm chuẩn bị cho các đợt điều chỉnh sắp tới. Cần giữ cái đầu lạnh và không nên FOMO...',
      sentiment: 'optimistic',
      assets: ['BTC', 'ETH'],
      date: '2024-05-24',
    },
    {
      id: '2',
      title: 'Lo ngại về lạm phát toàn cầu',
      content:
        'Chỉ số CPI mới nhất cao hơn dự kiến khiến thị trường chứng khoán rung lắc. Tôi nhận thấy sự an toàn từ vàng nên đã gia tăng tỷ trọng SJC. Đây là bước đi phòng thủ trong giai đoạn kinh tế vĩ mô bất ổn...',
      sentiment: 'worried',
      assets: ['SJC', 'Vàng nhẫn'],
      date: '2024-05-18',
    },
    {
      id: '3',
      title: 'Theo dõi VNM sau báo cáo quý',
      content:
        'Báo cáo kết quả kinh doanh quý của VNM không có nhiều đột biến. Lợi nhuận tăng trưởng ổn định nhưng chưa có động lực bứt phá. Tạm thời giữ nguyên vị thế và theo dõi thêm tín hiệu từ dòng tiền khối ngoại...',
      sentiment: 'neutral',
      assets: ['VNM'],
      date: '2024-05-12',
    },
  ],
  showForm: true,
  sentimentFilter: 'Tất cả',
  assetFilter: 'Tất cả',
  setShowForm: (showForm) => set({ showForm }),
  setSentimentFilter: (sentimentFilter) => set({ sentimentFilter }),
  setAssetFilter: (assetFilter) => set({ assetFilter }),
  addEntry: (data) =>
    set((s) => ({
      entries: [{ ...data, id: Date.now().toString() }, ...s.entries],
      showForm: false,
    })),
  removeEntry: (id) =>
    set((s) => ({
      entries: s.entries.filter((e) => e.id !== id),
    })),
}))
