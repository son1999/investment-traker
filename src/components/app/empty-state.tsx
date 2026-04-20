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
    <Card className="air-surface-lg border-dashed border-black/10 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)]">
      <CardContent className="flex flex-col items-center justify-center gap-5 px-6 py-16 text-center sm:px-10">
        {icon ? (
          <div className="flex size-18 items-center justify-center rounded-full bg-[var(--palette-surface-muted)] text-muted-foreground">
            {icon}
          </div>
        ) : null}
        <div className="max-w-xl space-y-2">
          {title ? <p className="text-xl font-semibold tracking-[-0.02em] text-foreground">{title}</p> : null}
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}
