export function formatMoney(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.-]/g, ''))
  if (!Number.isFinite(num)) return ''
  return num.toLocaleString('en-US')
}

export function parseMoney(value: string): string {
  return value.replace(/,/g, '').replace(/[^\d.-]/g, '')
}
