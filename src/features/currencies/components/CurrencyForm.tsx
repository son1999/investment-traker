import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormField } from '@/components/app'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { Currency } from '@/types/api'

interface CurrencyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currency?: Currency | null
  onSave: (data: { code: string; name: string; symbol: string; rateToVnd: number }) => void
  isPending: boolean
}

export default function CurrencyForm({
  open,
  onOpenChange,
  currency,
  onSave,
  isPending,
}: CurrencyFormProps) {
  const { t } = useTranslation()
  const isEdit = !!currency

  const [code, setCode] = useState(currency?.code || '')
  const [name, setName] = useState(currency?.name || '')
  const [symbol, setSymbol] = useState(currency?.symbol || '')
  const [rateToVnd, setRateToVnd] = useState(currency ? String(currency.rateToVnd) : '')

  const codeUpper = code.trim().toUpperCase()
  const isVND = codeUpper === 'VND'
  const rate = parseFloat(rateToVnd) || 0
  const canSubmit = !!code && !!name && !!symbol && rate > 0 && !isVND

  const handleSubmit = () => {
    if (!canSubmit) return
    onSave({ code: codeUpper, name, symbol, rateToVnd: rate })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('currencies.editCurrency') : t('currencies.addCurrency')}</DialogTitle>
          <DialogDescription>{t('currencies.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          <FormField label={t('currencies.code')}>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('currencies.codePlaceholder')}
              disabled={isEdit}
              className={isEdit ? 'opacity-60' : undefined}
            />
          </FormField>

          <FormField label={t('currencies.symbol')}>
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder={t('currencies.symbolPlaceholder')}
            />
          </FormField>

          <FormField label={t('currencies.name')} className="md:col-span-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('currencies.namePlaceholder')}
            />
          </FormField>

          <FormField label={t('currencies.rateToVnd')} className="md:col-span-2">
            <Input
              value={rateToVnd}
              onChange={(e) => setRateToVnd(e.target.value)}
              placeholder={t('currencies.rateToVndPlaceholder')}
              className="font-mono"
            />
          </FormField>
        </div>

        {isVND ? (
          <Alert variant="destructive">
            <AlertDescription>{t('currencies.vndBuiltIn')}</AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter>
          <DialogClose render={<Button variant="outline">{t('currencies.cancel')}</Button>} />
          <Button onClick={handleSubmit} disabled={isPending || !canSubmit}>
            {isPending ? '...' : t('currencies.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
