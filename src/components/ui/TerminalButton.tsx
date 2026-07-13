import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface TerminalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

export const TerminalButton = forwardRef<HTMLButtonElement, TerminalButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'text-xs px-5 py-3 transition-all duration-300 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm',
          {
            'bg-accent text-white dark:text-slate-950 hover:bg-accent/90 hover:shadow-[0_0_20px_var(--accent-dim)]': variant === 'default',
            'border border-accent/50 text-accent hover:bg-accent/10 backdrop-blur-md': variant === 'outline',
            'text-foreground hover:text-accent hover:bg-slate-800/20 dark:hover:bg-slate-100/10': variant === 'ghost',
          },
          className
        )}
        {...props}
      />
    )
  }
)
TerminalButton.displayName = 'TerminalButton'
