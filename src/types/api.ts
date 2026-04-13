// ── Common ──────────────────────────────────────────────
export type AssetType = 'metal' | 'crypto' | 'stock' | 'savings'
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

// ── Currencies ──────────────────────────────────────────
export interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  rateToVnd: number
  createdAt: string
  updatedAt: string
}

export interface CreateCurrencyRequest {
  code: string
  name: string
  symbol: string
  rateToVnd: number
}

export interface UpdateCurrencyRequest {
  name?: string
  symbol?: string
  rateToVnd?: number
}

// ── Auth ──────────────────────────────────────���─────────
export interface User {
  id: string
  email: string
  isGuest?: boolean
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
  currency: string
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
  unitPrice?: number
  totalAmount?: number
  note?: string
  icon: string
  iconBg: string
}

export interface UpdateTransactionRequest {
  date?: string
  action?: TransactionAction
  quantity?: number
  unitPrice?: number
  totalAmount?: number
  note?: string
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
  currency: string
  updatedAt: string
}

export interface CreatePriceRequest {
  code: string
  icon: string
  type: AssetType
  price: number
  currency?: string
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
  currency: string
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
  assetType: AssetType
  icon: string
  iconBg: string
  currency: string
  costNative: number
  valueNative: number
  cost: number
  value: number
  profit: number
  profitPercent: number
  positive: boolean
}

export interface PortfolioHistoryPoint {
  date: string
  value: number
  cost: number
  profit: number
  profitPercentage: number
}

export interface PortfolioHistory {
  period: string
  points: PortfolioHistoryPoint[]
}

// ── Assets ──────────────────────────────────────────────
export interface Asset {
  id: string
  code: string
  name: string
  type: AssetType
  currency: string
  icon: string
  iconBg: string
  interestRate?: number
  termMonths?: number
  bankName?: string
  maturityDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAssetRequest {
  code: string
  name: string
  type: AssetType
  currency?: string
  icon: string
  iconBg: string
  interestRate?: number
  termMonths?: number
  bankName?: string
  maturityDate?: string
}

export interface UpdateAssetRequest {
  name?: string
  type?: AssetType
  icon?: string
  iconBg?: string
  interestRate?: number
  termMonths?: number
  bankName?: string
  maturityDate?: string
}

export interface AssetDetail {
  assetCode: string
  assetType: AssetType
  currency: string
  icon: string
  iconBg: string
  metrics: {
    holdings: {
      quantity: number
      unit: string
      detail: string
    }
    avgCost: {
      value: number
      currency: string
    }
    currentPrice: {
      value: number
      currency: string
      updatedAt: string | null
    }
    profit: {
      amount: number
      percent: number
      positive: boolean
    }
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
  sellPrice: number
  profit: number
}

export interface AssetTransactionFilters {
  period?: Period
  action?: TransactionAction
  fromDate?: string
  toDate?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
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
    savings: number[]
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
  assetType: AssetType
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
  currency: string
  numPurchases: number
  avgIntervalDays: number
  avgPerPurchase: number
  purchaseAmounts: number[]
  purchaseDates: string[]
  purchaseUnitPrices: number[]
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

// ── CSV Import ─────────────────────────────────────────
export interface CSVImportResult {
  successCount: number
  errorCount: number
  errors: { row: number; message: string }[]
}

// ── Price Refresh ──────────────────────────────────────
export interface PriceRefreshResult {
  updated: { code: string; type: string; price: number }[]
  exchangeRates: { code: string; rate: number }[]
  count: number
}

// ── Live Price ─────────────────────────────────────────
export interface LivePriceResult {
  code: string
  type: string
  price: number | null
  currency: string
}

// ── Report Export ──────────────────────────────────────
export interface ReportExportParams {
  format: 'csv' | 'pdf'
  period?: Period
}
