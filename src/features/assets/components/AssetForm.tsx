import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { useCurrencies } from '@/hooks/useCurrencies'
import type { Asset, AssetType } from '@/types/api'

interface AssetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset?: Asset | null
  onSave: (data: { code: string; name: string; type: AssetType; currency?: string; icon: string; iconBg: string }) => void
  isPending: boolean
}

const defaultIconBgs: Record<AssetType, string> = {
  metal: 'rgba(248,160,16,0.2)',
  crypto: 'rgba(249,115,22,0.15)',
  stock: 'rgba(96,165,250,0.15)',
}

const defaultIcons: Record<AssetType, string> = {
  metal: '🥇',
  crypto: '₿',
  stock: '📈',
}

export default function AssetForm({ open, onOpenChange, asset, onSave, isPending }: AssetFormProps) {
  const { t } = useTranslation()
  const isEdit = !!asset
  const { data: currencies } = useCurrencies()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState<AssetType>('metal')
  const [currency, setCurrency] = useState('VND')
  const [icon, setIcon] = useState('🥇')
  const [iconBg, setIconBg] = useState('rgba(248,160,16,0.2)')

  useEffect(() => {
    if (asset) {
      setCode(asset.code)
      setName(asset.name)
      setType(asset.type)
      setCurrency(asset.currency || 'VND')
      setIcon(asset.icon)
      setIconBg(asset.iconBg)
    } else {
      setCode('')
      setName('')
      setType('metal')
      setCurrency('VND')
      setIcon('🥇')
      setIconBg('rgba(248,160,16,0.2)')
    }
  }, [asset, open])

  const handleTypeChange = (v: AssetType) => {
    setType(v)
    if (!isEdit) {
      setIcon(defaultIcons[v])
      setIconBg(defaultIconBgs[v])
    }
  }

  const handleSubmit = () => {
    if (!code || !name) return
    onSave({ code: code.toUpperCase(), name, type, currency, icon, iconBg })
  }

  const currencyOptions = [
    { code: 'VND', label: 'VND (₫)' },
    ...(currencies || []).map((c) => ({ code: c.code, label: `${c.code} (${c.symbol})` })),
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('assets.editAsset') : t('assets.addAsset')}</DialogTitle>
          <DialogDescription>{t('assets.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t('assets.code')}</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t('assets.codePlaceholder')}
                disabled={isEdit}
                className={isEdit ? 'opacity-50' : ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('assets.type')}</Label>
              <Select value={type} onValueChange={(v) => handleTypeChange(v as AssetType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="metal">{t('common.metal')}</SelectItem>
                  <SelectItem value="crypto">{t('common.crypto')}</SelectItem>
                  <SelectItem value="stock">{t('common.stock')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t('assets.name')}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('assets.namePlaceholder')} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('currencies.code')}</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t('assets.icon')}</Label>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg text-xl" style={{ backgroundColor: iconBg }}>{icon}</div>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder={t('assets.iconPlaceholder')} className="flex-1" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('assets.iconBg')}</Label>
              <Input value={iconBg} onChange={(e) => setIconBg(e.target.value)} placeholder={t('assets.iconBgPlaceholder')} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">{t('assets.cancel')}</Button>} />
          <Button onClick={handleSubmit} disabled={isPending || !code || !name}>
            {isPending ? '...' : t('assets.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
