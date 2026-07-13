import { cn } from '@/lib/utils'

interface TerminalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

export function TerminalCard({ children, className, title, ...props }: TerminalCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-foreground/10 dark:border-white/10 bg-card-bg/5 backdrop-blur-2xl shadow-xl flex flex-col group hover:shadow-2xl hover:border-accent/30 transition-all duration-300',
        className
      )}
      {...props}
    >
      {/* Decorative ambient glow inside the card */}
      <div className="absolute -z-10 -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full mix-blend-screen filter blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
      
      {title && (
        <div className="border-b border-border/30 bg-background/20 px-6 py-4 flex items-center justify-between text-xs font-semibold tracking-wider text-foreground/60 select-none">
          <span>{title}</span>
        </div>
      )}
      <div className="p-6 flex-1 relative z-10">
        {children}
      </div>
    </div>
  )
}
