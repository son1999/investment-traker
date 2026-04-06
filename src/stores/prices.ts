import { create } from 'zustand'

export interface PriceEntry {
  id: string
  code: string
  icon: string
  type: string
  price: number
  updatedAt: string
}

interface PricesState {
  prices: PriceEntry[]
  addPrice: (data: Omit<PriceEntry, 'id'>) => void
}

export const usePricesStore = create<PricesState>((set) => ({
  prices: [
    {
      id: '1',
      code: 'BTC',
      icon: '₿',
      type: 'Crypto',
      price: 1624000000,
      updatedAt: '10:45 - 22/10/2023',
    },
    {
      id: '2',
      code: 'FPT',
      icon: '📈',
      type: 'Cổ phiếu',
      price: 102400,
      updatedAt: '09:15 - 22/10/2023',
    },
    {
      id: '3',
      code: 'SJC',
      icon: '✨',
      type: 'Kim loại',
      price: 74500000,
      updatedAt: 'Hôm qua',
    },
  ],
  addPrice: (data) =>
    set((s) => ({
      prices: [{ ...data, id: Date.now().toString() }, ...s.prices],
    })),
}))
