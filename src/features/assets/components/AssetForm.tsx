import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormField } from '@/components/app'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCurrencies } from '@/hooks/useCurrencies'
import type { Asset, AssetType } from '@/types/api'

interface AssetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset?: Asset | null
  onSave: (data: {
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
  }) => void
  isPending: boolean
}

const defaultIconBgs: Record<AssetType, string> = {
  metal: 'rgba(248,160,16,0.2)',
  crypto: 'rgba(249,115,22,0.15)',
  stock: 'rgba(96,165,250,0.15)',
  savings: 'rgba(34,197,94,0.15)',
}

const defaultIcons: Record<AssetType, string> = {
  metal: '🥇',
  crypto: '₿',
  stock: '📈',
  savings: '🏦',
}

export default function AssetForm({
  open,
  onOpenChange,
  asset,
  onSave,
  isPending,
}: AssetFormProps) {
  const { t } = useTranslation()
  const isEdit = !!asset
  const { data: currencies } = useCurrencies()

  const [code, setCode] = useState(asset?.code || '')
  const [name, setName] = useState(asset?.name || '')
  const [type, setType] = useState<AssetType>(asset?.type || 'metal')
  const [currency, setCurrency] = useState(asset?.currency || 'VND')
  const [icon, setIcon] = useState(asset?.icon || '🥇')
  const [iconBg, setIconBg] = useState(asset?.iconBg || 'rgba(248,160,16,0.2)')
  const [interestRate, setInterestRate] = useState(asset?.interestRate?.toString() || '')
  const [termMonths, setTermMonths] = useState(asset?.termMonths?.toString() || '')
  const [bankName, setBankName] = useState(asset?.bankName || '')
  const [maturityDate, setMaturityDate] = useState(asset?.maturityDate || '')

  const handleTypeChange = (value: AssetType) => {
    setType(value)
    if (!isEdit) {
      setIcon(defaultIcons[value])
      setIconBg(defaultIconBgs[value])
    }
  }

  const handleSubmit = () => {
    if (!code || !name) return

    const data: Parameters<typeof onSave>[0] = {
      code: code.toUpperCase(),
      name,
      type,
      currency,
      icon,
      iconBg,
    }

    if (type === 'savings') {
      if (interestRate) data.interestRate = parseFloat(interestRate)
      if (termMonths) data.termMonths = parseInt(termMonths)
      if (bankName) data.bankName = bankName
      if (maturityDate) data.maturityDate = maturityDate
    }

    onSave(data)
  }

  const currencyOptions = [
    { code: 'VND', label: 'VND (₫)' },
    ...(currencies || []).map((current) => ({
      code: current.code,
      label: `${current.code} (${current.symbol})`,
    })),
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('assets.editAsset') : t('assets.addAsset')}</DialogTitle>
          <DialogDescription>{t('assets.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          <FormField label={t('assets.code')}>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('assets.codePlaceholder')}
              disabled={isEdit}
              className={isEdit ? 'opacity-60' : undefined}
            />
          </FormField>

          <FormField label={t('assets.type')}>
            <Select value={type} onValueChange={(value) => handleTypeChange(value as AssetType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metal">{t('common.metal')}</SelectItem>
                <SelectItem value="crypto">{t('common.crypto')}</SelectItem>
                <SelectItem value="stock">{t('common.stock')}</SelectItem>
                <SelectItem value="savings">{t('common.savings')}</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label={t('assets.name')}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('assets.namePlaceholder')}
            />
          </FormField>

          <FormField label={t('currencies.code')}>
            <Select value={currency} onValueChange={(value) => value && setCurrency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((current) => (
                  <SelectItem key={current.code} value={current.code}>
                    {current.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label={t('assets.icon')}>
            <div className="flex items-center gap-2">
              <div
                className="flex size-10 items-center justify-center rounded-lg text-xl"
                style={{ backgroundColor: iconBg }}
              >
                {icon}
              </div>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder={t('assets.iconPlaceholder')}
              />
            </div>
          </FormField>

          <FormField label={t('assets.iconBg')}>
            <Input
              value={iconBg}
              onChange={(e) => setIconBg(e.target.value)}
              placeholder={t('assets.iconBgPlaceholder')}
            />
          </FormField>

          {type === 'savings' ? (
            <>
              <FormField label={t('assets.interestRate')}>
                <Input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder={t('assets.interestRatePlaceholder')}
                />
              </FormField>

              <FormField label={t('assets.termMonths')}>
                <Input
                  type="number"
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                  placeholder={t('assets.termMonthsPlaceholder')}
                />
              </FormField>

              <FormField label={t('assets.bankName')}>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder={t('assets.bankNamePlaceholder')}
                />
              </FormField>

              <FormField label={t('assets.maturityDate')}>
                <Input
                  type="date"
                  value={maturityDate}
                  onChange={(e) => setMaturityDate(e.target.value)}
                />
              </FormField>
            </>
          ) : null}
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
