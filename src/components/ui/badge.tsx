import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1 rounded-[14px] border px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-ring [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-[color:rgba(255,56,92,0.16)] bg-[rgba(255,56,92,0.1)] text-[var(--palette-bg-tertiary-core)]",
        secondary:
          "border-black/5 bg-[var(--palette-surface-subtle)] text-foreground",
        destructive:
          "border-[color:rgba(193,53,21,0.16)] bg-[rgba(193,53,21,0.08)] text-destructive",
        outline: "border-black/8 bg-white text-foreground",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
        link: "border-transparent bg-transparent px-0 text-foreground hover:text-[var(--palette-bg-primary-core)] hover:underline",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
)

function Badge({
  className,
  variant = "secondary",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge }
