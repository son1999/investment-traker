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
      <CardHeader className="border-b">
        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="min-w-0 px-0">{children}</CardContent>
      {footer ? <div className="border-t bg-muted/40 px-4 py-3">{footer}</div> : null}
    </Card>
  )
}
