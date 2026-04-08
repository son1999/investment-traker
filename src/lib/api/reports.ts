import client from './client'
import type {
  PerformanceData,
  ReportSummary,
  CashFlowItem,
  TopAsset,
  PerformanceComparison,
  DCAChartData,
  DCAHistoryEntry,
  DCAComparisonData,
  Period,
} from '@/types/api'

export async function getPerformance(period?: Period): Promise<PerformanceData> {
  const res = await client.get<{ data: PerformanceData }>('/api/reports/performance', { params: { period } })
  return res.data.data
}

export async function getSummary(period?: Period): Promise<ReportSummary> {
  const res = await client.get<{ data: ReportSummary }>('/api/reports/summary', { params: { period } })
  return res.data.data
}

export async function getCashFlow(period?: Period): Promise<CashFlowItem[]> {
  const res = await client.get<{ data: CashFlowItem[] }>('/api/reports/cash-flow', { params: { period } })
  return res.data.data
}

export async function getTopAssets(period?: Period, limit = 5): Promise<TopAsset[]> {
  const res = await client.get<{ data: TopAsset[] }>('/api/reports/top-assets', { params: { period, limit } })
  return res.data.data
}

export async function getPerformanceComparison(): Promise<PerformanceComparison[]> {
  const res = await client.get<{ data: PerformanceComparison[] }>('/api/reports/performance-comparison')
  return res.data.data
}

export async function getDCAChart(code: string): Promise<DCAChartData> {
  const res = await client.get<{ data: DCAChartData }>('/api/reports/dca-chart', { params: { code } })
  return res.data.data
}

export async function getDCAHistory(code: string): Promise<DCAHistoryEntry[]> {
  const res = await client.get<{ data: DCAHistoryEntry[] }>('/api/reports/dca-history', { params: { code } })
  return res.data.data
}

export async function getDCAComparison(code: string): Promise<DCAComparisonData> {
  const res = await client.get<{ data: DCAComparisonData }>('/api/reports/dca-comparison', { params: { code } })
  return res.data.data
}
