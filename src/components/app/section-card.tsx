import type { ReactNode } from 'react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
  size?: 'default' | 'sm'
}

export function SectionCard({
  title,
  description,
  action,
  children,
  footer,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  size = 'default',
}: SectionCardProps) {
  return (
    <Card size={size} className={cn('w-full min-w-0', className)}>
      {(title || description || action) ? (
        <CardHeader
          className={cn(
            'border-b border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)]',
            headerClassName,
          )}
        >
          <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              {title ? <CardTitle>{title}</CardTitle> : null}
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
            {action ? <CardAction>{action}</CardAction> : null}
          </div>
        </CardHeader>
      ) : null}
      <CardContent className={cn('space-y-5 pt-5', contentClassName)}>{children}</CardContent>
      {footer ? <CardFooter className={footerClassName}>{footer}</CardFooter> : null}
    </Card>
  )
}
