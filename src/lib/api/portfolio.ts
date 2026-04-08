import client from './client'
import type {
  PortfolioSummary,
  Holding,
  AllocationItem,
  ProfitByAsset,
  PortfolioHistory,
  Period,
} from '@/types/api'

export async function getSummary(): Promise<PortfolioSummary> {
  const res = await client.get<{ data: PortfolioSummary }>('/api/portfolio/summary')
  return res.data.data
}

export async function getHoldings(): Promise<Holding[]> {
  const res = await client.get<{ data: Holding[] }>('/api/portfolio/holdings')
  return res.data.data
}

export async function getAllocation(): Promise<AllocationItem[]> {
  const res = await client.get<{ data: AllocationItem[] }>('/api/portfolio/allocation')
  return res.data.data
}

export async function getProfitByAsset(): Promise<ProfitByAsset[]> {
  const res = await client.get<{ data: ProfitByAsset[] }>('/api/portfolio/profit-by-asset')
  return res.data.data
}

export async function getHistory(period: Period = '6m'): Promise<PortfolioHistory> {
  const res = await client.get<{ data: PortfolioHistory }>('/api/portfolio/history', { params: { period } })
  return res.data.data
}
