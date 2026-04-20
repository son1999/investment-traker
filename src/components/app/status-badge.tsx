import type { ReactNode } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva('gap-1.5', {
  variants: {
    tone: {
      neutral: 'border-black/6 bg-[var(--palette-surface-subtle)] text-foreground',
      positive: 'border-[color:rgba(0,138,98,0.16)] bg-[rgba(0,138,98,0.08)] text-[var(--positive)]',
      negative:
        'border-[color:rgba(193,53,21,0.16)] bg-[rgba(193,53,21,0.08)] text-[var(--destructive)]',
      warning: 'border-[color:rgba(183,121,31,0.16)] bg-[rgba(183,121,31,0.08)] text-[var(--gold)]',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
})

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: ReactNode
  className?: string
}

export function StatusBadge({
  tone,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(statusBadgeVariants({ tone }), className)}>
      {children}
    </Badge>
  )
}
