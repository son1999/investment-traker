export function formatMoney(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.-]/g, ''))
  if (!Number.isFinite(num)) return ''
  return num.toLocaleString('en-US')
}

export function parseMoney(value: string): string {
  return value.replace(/,/g, '').replace(/[^\d.-]/g, '')
}

/**
 * Display a money value with full precision. NEVER round or compact-format money.
 * VND: integer with vi-VN thousand separators (e.g. "5.065.123 ₫").
 * Other currencies: up to 8 decimal places preserved (e.g. "1.234,56 USD").
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = 'VND',
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  const isVnd = currency === 'VND'
  const formatted = value.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: isVnd ? 0 : 8,
  })
  const suffix = isVnd ? '₫' : currency
  return `${formatted}\u00A0${suffix}`
}

/**
 * Like formatCurrency but with explicit sign for positives. Used for profit/loss displays.
 */
export function formatCurrencySigned(
  value: number | null | undefined,
  currency: string = 'VND',
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return sign + formatCurrency(value, currency)
}

/**
 * Compact label for chart axis ticks ONLY. Never use for displaying real money values.
 * Money displays must use formatCurrency.
 */
export function formatAxisCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e9) return `${(value / 1e9).toFixed(1)}B`
  if (abs >= 1e6) return `${(value / 1e6).toFixed(1)}M`
  if (abs >= 1e3) return `${(value / 1e3).toFixed(0)}K`
  return String(value)
}
