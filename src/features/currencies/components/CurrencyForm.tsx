import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import type { Currency } from '@/types/api'

interface CurrencyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currency?: Currency | null
  onSave: (data: { code: string; name: string; symbol: string; rateToVnd: number }) => void
  isPending: boolean
}

export default function CurrencyForm({ open, onOpenChange, currency, onSave, isPending }: CurrencyFormProps) {
  const { t } = useTranslation()
  const isEdit = !!currency

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [rateToVnd, setRateToVnd] = useState('')

  useEffect(() => {
    if (currency) {
      setCode(currency.code)
      setName(currency.name)
      setSymbol(currency.symbol)
      setRateToVnd(String(currency.rateToVnd))
    } else {
      setCode('')
      setName('')
      setSymbol('')
      setRateToVnd('')
    }
  }, [currency, open])

  const handleSubmit = () => {
    const rate = parseFloat(rateToVnd) || 0
    if (!code || !name || !symbol || rate <= 0) return
    onSave({ code: code.toUpperCase(), name, symbol, rateToVnd: rate })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('currencies.editCurrency') : t('currencies.addCurrency')}</DialogTitle>
          <DialogDescription>{t('currencies.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t('currencies.code')}</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t('currencies.codePlaceholder')}
                disabled={isEdit}
                className={isEdit ? 'opacity-50' : ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('currencies.symbol')}</Label>
              <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder={t('currencies.symbolPlaceholder')} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('currencies.name')}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('currencies.namePlaceholder')} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('currencies.rateToVnd')}</Label>
            <Input value={rateToVnd} onChange={(e) => setRateToVnd(e.target.value)} placeholder={t('currencies.rateToVndPlaceholder')} className="font-['JetBrains_Mono']" />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">{t('currencies.cancel')}</Button>} />
          <Button onClick={handleSubmit} disabled={isPending || !code || !name || !symbol}>
            {isPending ? '...' : t('currencies.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
