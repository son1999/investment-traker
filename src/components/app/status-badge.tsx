import type { ReactNode } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva('gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium', {
  variants: {
    tone: {
      neutral: 'bg-secondary text-secondary-foreground',
      positive: 'bg-positive/10 text-positive',
      negative: 'bg-destructive/10 text-destructive',
      warning: 'bg-gold/10 text-gold',
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
    <Badge
      variant="secondary"
      className={cn(statusBadgeVariants({ tone }), className)}
    >
      {children}
    </Badge>
  )
}
