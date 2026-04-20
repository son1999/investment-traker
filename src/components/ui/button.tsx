import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap border border-transparent font-medium tracking-[0.01em] transition-[transform,box-shadow,background-color,color,border-color] duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:border-[color:var(--palette-bg-primary-core)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--palette-bg-primary-core)] text-white shadow-[var(--shadow-card)] hover:bg-[var(--palette-bg-tertiary-core)] hover:shadow-[var(--shadow-hover)]",
        outline:
          "border-black/8 bg-white text-foreground shadow-[var(--shadow-card)] hover:border-black/12 hover:shadow-[var(--shadow-hover)]",
        secondary:
          "bg-[var(--palette-surface-muted)] text-foreground hover:bg-[#ebebeb]",
        ghost:
          "bg-transparent text-foreground hover:bg-[var(--palette-surface-muted)]",
        destructive:
          "bg-[var(--palette-text-primary-error)] text-white shadow-[var(--shadow-card)] hover:bg-[var(--palette-text-secondary-error-hover)] hover:shadow-[var(--shadow-hover)]",
        link: "border-none bg-transparent px-0 text-foreground shadow-none hover:text-[var(--palette-bg-primary-core)] hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 rounded-xl px-4 text-[0.95rem] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-full px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-full px-3.5 text-[0.82rem] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 rounded-2xl px-6 text-[0.95rem] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-11 rounded-full",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
