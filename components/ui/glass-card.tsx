import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface GlassCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode
  variant?: 'default' | 'neo' | 'ghost'
}

export function GlassCard({ className, children, variant = 'default', ...props }: GlassCardProps) {
  return (
    <Card
      className={cn(
        "glass-card border-none bg-zinc-900/40 backdrop-blur-sm transition-[transform,opacity,border-color,background-color] duration-300 will-change-transform", // Explicit transitions and reduced blur
        variant === 'neo' && "border border-white/5 shadow-xl shadow-black/50 bg-gradient-to-br from-white/5 to-transparent",
        variant === 'ghost' && "bg-transparent border border-zinc-800/30",
        // Interactive hover effects by default for now, or we can add a prop. User asked for interactive, so let's making them feel alive.
        "hover:scale-[1.02] hover:bg-zinc-200/10 hover:border-zinc-200/20 cursor-pointer hover:shadow-xl hover:shadow-zinc-200/10",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
