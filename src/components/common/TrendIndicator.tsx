import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { calculatePeriodDelta, formatDelta } from '@/lib/production'
import { cn } from '@/lib/utils'

interface TrendIndicatorProps {
  current: number
  previous: number
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TrendIndicator({
  current,
  previous,
  showPercentage = true,
  size = 'md',
  className
}: TrendIndicatorProps) {
  const delta = calculatePeriodDelta(current, previous)
  // Convert absolute delta to percentage points for display (e.g., 0.05 -> 5.0%)
  const deltaValue = showPercentage ? delta.delta * 100 : delta.delta
  const formattedDelta = formatDelta(deltaValue, showPercentage)

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  // If no change, show minus icon
  if (Math.abs(delta.delta) < 0.001) {
    return (
      <div className={cn('flex items-center gap-1 text-muted-foreground', className)}>
        <Minus className={sizeClasses[size]} />
        <span className={textSizeClasses[size]}>No change</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        formattedDelta.colorClass,
        className
      )}
    >
      {delta.isImprovement ? (
        <ArrowUp className={sizeClasses[size]} />
      ) : (
        <ArrowDown className={sizeClasses[size]} />
      )}
      <span className={cn('font-medium', textSizeClasses[size])}>
        {formattedDelta.value}
      </span>
    </div>
  )
}

