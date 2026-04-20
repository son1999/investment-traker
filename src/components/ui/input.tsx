import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-[18px] border border-black/8 bg-white px-4 py-3 text-[0.95rem] text-foreground shadow-[var(--shadow-card)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-[color:var(--palette-bg-primary-core)] focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--palette-surface-subtle)] disabled:text-[color:var(--palette-text-material-disabled)] aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-[color:rgba(193,53,21,0.12)] md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
