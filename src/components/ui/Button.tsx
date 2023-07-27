import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm leading-none font-medium transition-colors focus:outline-none disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900",
  {
    variants: {
      // variant: {
      //   default:
      //     'bg-zinc-900 text-zinc-100 hover:bg-zinc-800',
      //   destructive: 'text-white hover:bg-red-600 dark:hover:bg-red-600',
      //   outline:
      //     'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 outline outline-1 outline-zinc-300',
      //   subtle:
      //     'hover:bg-zinc-200 bg-zinc-100 text-zinc-900',
      //   ghost:
      //     'bg-transparent hover:bg-zinc-100 text-zinc-800 data-[state=open]:bg-transparent data-[state=open]:bg-transparent',
      //   link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
      // },
      variant: {
        default:
          "bg-slate-900 text-slate-100 hover:bg-slate-800",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        subtle:
          'hover:bg-slate-200 bg-slate-100 text-slate-900',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-800 data-[state=open]:bg-transparent data-[state=open]:bg-transparent',
        link: "text-slate underline-offset-4 hover:underline",
      },
      size: {
        // default: "h-10 px-4 py-2",
        // xs: 'h-8 px-1.5 rounded-md',
        // sm: "h-9 rounded-md px-3",
        // lg: "h-11 rounded-md px-8",
        // icon: "h-10 w-10",
        button: "rounded-md px-2 py-2",
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, isLoading, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}>
        {isLoading ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : null}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
