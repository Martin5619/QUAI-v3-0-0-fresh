import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  text?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  center?: boolean
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function LoadingState({
  text,
  className,
  size = 'md',
  center = true,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        center && 'justify-center',
        className
      )}
    >
      <Loader2 className={cn('animate-spin', sizeMap[size])} />
      {text && (
        <span className="text-muted-foreground">
          {text}
        </span>
      )}
    </div>
  )
}
