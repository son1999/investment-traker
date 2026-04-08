// ── Common ──────────────────────────────────────────────
export type AssetType = 'metal' | 'crypto' | 'stock'
export type TransactionAction = 'MUA' | 'BAN'
export type Period = '1m' | '3m' | '6m' | '1y' | 'all'
export type AllocationStatus = 'on-target' | 'overweight' | 'underweight'

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}

// ── Auth ──────────────────────────────────────���─────────
export interface User {
  id: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// ── Transactions ────────────────────────────────────────
export interface Transaction {
  id: string
  date: string
  assetType: AssetType
  assetCode: string
  action: TransactionAction
  quantity: number
  unitPrice: number
  note?: string
  icon: string
  iconBg: string
}

export interface CreateTransactionRequest {
  date: string
  assetType: AssetType
  assetCode: string
  action: TransactionAction
  quantity: number
  unitPrice: number
  note?: string
  icon: string
  iconBg: string
}

export interface TransactionFilters {
  filter?: AssetType
  search?: string
  page?: number
  limit?: number
}

// ── Prices ──────────────────────────────────────────────
export interface PriceEntry {
  id: string
  code: string
  icon: string
  type: AssetType
  price: number
  updatedAt: string
}

export interface CreatePriceRequest {
  code: string
  icon: string
  type: AssetType
  price: number
}

// ── Portfolio ───────────────────────────────────────────
export interface PortfolioSummary {
  totalValue: number
  capitalInvested: number
  profit: number
  profitPercentage: number
  assetsCount: number
  buyOrdersCount: number
  assetCodes: string[]
}

export interface Holding {
  assetCode: string
  assetType: AssetType
  name: string
  icon: string
  iconBg: string
  quantity: number
  averageCost: number
  currentPrice: number
  value: number
  profitLossPercent: number
  profitLossAmount: number
  positive: boolean
}

export interface AllocationItem {
  assetType: AssetType
  label: string
  value: number
  amount: number
}

export interface ProfitByAsset {
  symbol: string
  profitPercent: number
  positive: boolean
}

export interface PortfolioHistoryPoint {
  date: string
  value: number
}

export interface PortfolioHistory {
  period: string
  points: PortfolioHistoryPoint[]
}

// ── Assets ──────────────────────────────────────────────
export interface AssetDetail {
  assetCode: string
  assetType: AssetType
  icon: string
  iconBg: string
  metrics: {
    holdings: number
    avgCost: number
    currentPrice: number
    profit: number
  }
  realizedPnl: {
    total: number
    transactions: RealizedPnlTx[]
  }
  unrealizedPnl: {
    total: number
    currentValue: number
    totalCost: number
  }
  valueHistory: PortfolioHistoryPoint[]
}

export interface RealizedPnlTx {
  date: string
  quantity: number
  buyPrice: number
  sellPrice: number
  pnl: number
}

export interface AssetTransaction {
  id: string
  date: string
  action: TransactionAction
  quantity: number
  unitPrice: number
  total: number
  note?: string
}

// ── Allocation ──────────────────────────────────────────
export interface AllocationCurrent {
  assetType: AssetType
  name: string
  value: number
  actualPercent: number
  targetPercent: number
  status: AllocationStatus
}

export interface AllocationTarget {
  assetType: AssetType
  targetPercent: number
}

export interface AllocationRecommendation {
  actions: {
    assetType: AssetType
    action: string
    amount: number
    description: string
  }[]
  summary: string
}

// ── Reports ─────────────────────────────────────────────
export interface PerformanceData {
  months: string[]
  series: {
    metal: number[]
    crypto: number[]
    stock: number[]
  }
}

export interface ReportSummary {
  totalDeposited: number
  totalWithdrawn: number
  realizedPnl: number
  unrealizedPnl: number
}

export interface CashFlowItem {
  month: string
  inflow: number
  outflow: number
}

export interface TopAsset {
  rank: number
  assetCode: string
  name: string
  icon: string
  invested: number
  currentValue: number
  profitLossPercent: number
  profitLossAmount: number
  positive: boolean
  weight: number
}

export interface PerformanceComparison {
  name: string
  assetCode: string
  invested: number
  currentValue: number
  profitPercent: number
  positive: boolean
}

export interface DCAChartData {
  assetCode: string
  numPurchases: number
  avgIntervalDays: number
  avgPerPurchase: number
  purchaseAmounts: number[]
  avgCostPrices: number[]
  currentPrice: number
}

export interface DCAHistoryEntry {
  number: number
  date: string
  unitPrice: number
  quantity: number
  total: number
}

export interface DCAComparisonData {
  dca: {
    avgCost: number
    totalCapital: number
    currentValue: number
    profit: number
    profitPercent: number
  }
  lumpSum: {
    priceAtFirstBuy: number
    totalCapital: number
    currentValue: number
    profit: number
    profitPercent: number
  }
}
