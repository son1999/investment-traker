import { useQuery } from '@tanstack/react-query'
import { portfolioApi } from '@/lib/api'
import type { PortfolioSummary, Holding, AllocationItem, ProfitByAsset, PortfolioHistory, Period } from '@/types/api'

export function usePortfolioSummary() {
  return useQuery<PortfolioSummary>({
    queryKey: ['portfolio', 'summary'],
    queryFn: portfolioApi.getSummary,
  })
}

export function useHoldings() {
  return useQuery<Holding[]>({
    queryKey: ['portfolio', 'holdings'],
    queryFn: portfolioApi.getHoldings,
  })
}

export function useAllocation() {
  return useQuery<AllocationItem[]>({
    queryKey: ['portfolio', 'allocation'],
    queryFn: portfolioApi.getAllocation,
  })
}

export function useProfitByAsset() {
  return useQuery<ProfitByAsset[]>({
    queryKey: ['portfolio', 'profit-by-asset'],
    queryFn: portfolioApi.getProfitByAsset,
  })
}

export function usePortfolioHistory(period: Period = '6m') {
  return useQuery<PortfolioHistory>({
    queryKey: ['portfolio', 'history', period],
    queryFn: () => portfolioApi.getHistory(period),
  })
}
