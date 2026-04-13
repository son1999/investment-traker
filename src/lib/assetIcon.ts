const stockLogos: Record<string, string> = {
  HPG: 'https://cdn.24hmoney.vn/upload/images_cr/2021-12-03/partner/images/uploaded/dulieudownload/logodn/HPG_1.png',
  ACB: 'https://cdn.24hmoney.vn/upload/images_cr/2022-04-18/partner/uploads/2019/08/31/thebank_thebank_ynghialogonganhangacbmin_1566720925min_1567243551.png',
}

const metalLogos: Record<string, string> = {
  GOLD: 'https://api.iconify.design/noto/coin.svg',
  SJC: 'https://api.iconify.design/noto/coin.svg',
}

export function getAssetIconUrl(code: string, assetType: string): string | null {
  if (!code) return null
  const lower = code.toLowerCase()
  const upper = code.toUpperCase()
  if (assetType === 'crypto') {
    return `https://assets.coincap.io/assets/icons/${lower}@2x.png`
  }
  if (assetType === 'stock') {
    return stockLogos[upper] ?? null
  }
  if (assetType === 'metal') {
    return metalLogos[upper] ?? null
  }
  return null
}
