import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateOrUpdatePrice } from '@/hooks/usePrices'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AssetType } from '@/types/api'

const typeIcons: Record<string, string> = { metal: '✨', crypto: '₿', stock: '📈' }

export default function PriceForm() {
  const { t } = useTranslation()
  const createPrice = useCreateOrUpdatePrice()
  const [assetType, setAssetType] = useState<AssetType>('metal')
  const [assetCode, setAssetCode] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = async () => {
    const p = parseFloat(price) || 0
    if (!assetCode || p <= 0) return
    await createPrice.mutateAsync({ code: assetCode.toUpperCase(), icon: typeIcons[assetType] || '💰', type: assetType, price: p })
    setAssetCode(''); setPrice('')
  }

  return (
    <div className="rounded-lg border border-edge bg-panel p-8 shadow-sm">
      <h2 className="mb-8 text-lg font-semibold text-heading">{t('prices.newPrice')}</h2>
      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">{t('prices.type')}</label>
          <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
            <SelectTrigger className="h-11 w-full rounded border-none bg-field px-4 text-sm text-body"><SelectValue /></SelectTrigger>
            <SelectContent className="border-edge-strong bg-panel-alt text-body">
              <SelectItem value="metal">{t('common.metal')}</SelectItem>
              <SelectItem value="crypto">{t('common.crypto')}</SelectItem>
              <SelectItem value="stock">{t('common.stock')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">{t('prices.code')}</label>
          <Input value={assetCode} onChange={(e) => setAssetCode(e.target.value)} placeholder="Vd: BTC, PNJ" className="h-11 rounded border-none bg-field px-4 text-sm text-body placeholder:text-dim" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-[1.1px] text-caption">{t('prices.currentPrice')}</label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className="h-11 rounded border-none bg-field px-4 font-['JetBrains_Mono'] text-sm text-body placeholder:text-dim" />
        </div>
        <div className="flex flex-col justify-end">
          <button onClick={handleSubmit} disabled={createPrice.isPending} className="h-11 cursor-pointer rounded bg-btn text-base font-semibold text-on-btn transition-colors hover:bg-btn-hover disabled:opacity-50">
            {createPrice.isPending ? '...' : t('prices.update')}
          </button>
        </div>
      </div>
    </div>
  )
}
