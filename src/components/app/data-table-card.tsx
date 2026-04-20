import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DataTableCardProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function DataTableCard({
  title,
  description,
  action,
  children,
  footer,
  className,
}: DataTableCardProps) {
  return (
    <Card className={cn('w-full min-w-0 overflow-hidden', className)}>
      <CardHeader className="border-b border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)]">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <span className="air-section-eyebrow">Operational View</span>
            <div className="space-y-1">
              <CardTitle>{title}</CardTitle>
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
          </div>
          {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="min-w-0 px-0 pb-0">{children}</CardContent>
      {footer ? <div className="border-t border-black/5 bg-[var(--palette-surface-subtle)] px-5 py-4 sm:px-6">{footer}</div> : null}
    </Card>
  )
}
