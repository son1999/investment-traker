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
    <Card size={size} className={className}>
      {(title || description || action) && (
        <CardHeader className={headerClassName}>
          <div className="space-y-1">
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      )}
      <CardContent className={cn('space-y-4', contentClassName)}>{children}</CardContent>
      {footer ? <CardFooter className={footerClassName}>{footer}</CardFooter> : null}
    </Card>
  )
}
