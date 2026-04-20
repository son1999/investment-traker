import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'air-surface-lg relative overflow-hidden px-6 py-7 sm:px-8 sm:py-8',
        className,
      )}
    >
      <div className="air-photo-art absolute inset-y-0 right-0 hidden w-72 md:block" />
      <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-3xl space-y-3">
          <span className="air-section-eyebrow">Portfolio Atelier</span>
          <div className="space-y-2">
            <h1 className="text-[clamp(1.8rem,3vw,2.35rem)] leading-[1.08] font-bold tracking-[-0.04em] text-foreground">
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="relative z-10 flex max-w-full flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  )
}
