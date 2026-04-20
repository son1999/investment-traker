import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card air-surface min-w-0 overflow-hidden text-sm text-card-foreground data-[size=default]:rounded-[20px] data-[size=sm]:rounded-[18px] data-[size=sm]:shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex min-w-0 flex-col gap-2 px-5 py-5 sm:px-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-4",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-[1.125rem] leading-[1.18] font-semibold tracking-[-0.02em] text-foreground group-data-[size=sm]/card:text-base",
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("flex shrink-0 items-center gap-2 self-start", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("min-w-0 px-5 pb-5 sm:px-6 sm:pb-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pb-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-3 border-t border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] px-5 py-4 sm:px-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3",
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
