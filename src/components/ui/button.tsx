import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-200 active:animate-button-press",
  {
    variants: {
      variant: {
        default: "bg-sky-500 text-white hover:bg-sky-600 tropical-shadow hover:tropical-shadow-lg",
        secondary: "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 tropical-shadow hover:tropical-shadow-lg",
        outline: "border border-gray-200 bg-white hover:bg-sky-50 text-gray-900 tropical-shadow hover:tropical-shadow-lg",
        ghost: "hover:bg-sky-50 text-gray-900",
        destructive: "bg-red-500 text-white hover:bg-red-600 tropical-shadow hover:tropical-shadow-lg",
        tropical: "bg-gradient-to-r from-sky-400 to-emerald-400 text-white hover:from-sky-500 hover:to-emerald-500 tropical-shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-9 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }