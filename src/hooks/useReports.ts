import { useQuery, useMutation } from '@tanstack/react-query'
import { reportsApi } from '@/lib/api'
import { toast } from 'sonner'
import type {
  Period,
  PerformanceData,
  ReportSummary,
  CashFlowItem,
  TopAsset,
  PerformanceComparison,
  DCAChartData,
  DCAHistoryEntry,
  DCAComparisonData,
  ReportExportParams,
} from '@/types/api'

export function usePerformance(period?: Period) {
  return useQuery<PerformanceData>({
    queryKey: ['reports', 'performance', period],
    queryFn: () => reportsApi.getPerformance(period),
  })
}

export function useReportSummary(period?: Period) {
  return useQuery<ReportSummary>({
    queryKey: ['reports', 'summary', period],
    queryFn: () => reportsApi.getSummary(period),
  })
}

export function useCashFlow(period?: Period) {
  return useQuery<CashFlowItem[]>({
    queryKey: ['reports', 'cash-flow', period],
    queryFn: () => reportsApi.getCashFlow(period),
  })
}

export function useTopAssets(period?: Period, limit = 5) {
  return useQuery<TopAsset[]>({
    queryKey: ['reports', 'top-assets', period, limit],
    queryFn: () => reportsApi.getTopAssets(period, limit),
  })
}

export function usePerformanceComparison() {
  return useQuery<PerformanceComparison[]>({
    queryKey: ['reports', 'performance-comparison'],
    queryFn: reportsApi.getPerformanceComparison,
  })
}

export function useDCAChart(code: string) {
  return useQuery<DCAChartData>({
    queryKey: ['reports', 'dca-chart', code],
    queryFn: () => reportsApi.getDCAChart(code),
    enabled: !!code,
  })
}

export function useDCAHistory(code: string) {
  return useQuery<DCAHistoryEntry[]>({
    queryKey: ['reports', 'dca-history', code],
    queryFn: () => reportsApi.getDCAHistory(code),
    enabled: !!code,
  })
}

export function useDCAComparison(code: string) {
  return useQuery<DCAComparisonData>({
    queryKey: ['reports', 'dca-comparison', code],
    queryFn: () => reportsApi.getDCAComparison(code),
    enabled: !!code,
  })
}

export function useExportReport() {
  return useMutation({
    mutationFn: (params: ReportExportParams) => reportsApi.exportReport(params),
    onSuccess: (blob, params) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report.${params.format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Đã xuất báo cáo')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Xuất báo cáo thất bại')
    },
  })
}
