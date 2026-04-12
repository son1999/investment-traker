import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  icon?: ReactNode
  title?: ReactNode
  description: ReactNode
  action?: ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        {icon ? <div className="text-muted-foreground/50">{icon}</div> : null}
        <div className="space-y-1">
          {title ? <p className="font-medium">{title}</p> : null}
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}
