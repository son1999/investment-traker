import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PriceInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  label: string
  onSubmit: (price: number) => void
  isPending?: boolean
  submitLabel?: string
  cancelLabel?: string
}

export function PriceInputDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  onSubmit,
  isPending = false,
  submitLabel = 'OK',
  cancelLabel = 'Cancel',
}: PriceInputDialogProps) {
  const [value, setValue] = useState('')

  const price = parseFloat(value)
  const valid = !isNaN(price) && price > 0

  const handleSubmit = () => {
    if (!valid) return
    onSubmit(price)
    setValue('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Label>{label}</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0"
            className="font-['JetBrains_Mono']"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={isPending} />}>
            {cancelLabel}
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!valid || isPending}>
            {isPending ? '...' : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
