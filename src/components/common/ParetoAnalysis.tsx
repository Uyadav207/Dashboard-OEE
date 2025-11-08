import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDowntimeByCategory } from '@/lib/production'
import { formatDuration } from '@/lib/utils'
import { PARETO_CATEGORIES } from '@/lib/constants'
import type { DowntimeEvent } from '@/types/production'
import { BarChart3 } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface ParetoAnalysisProps {
  downtimeEvents: DowntimeEvent[]
}

export function ParetoAnalysis({ downtimeEvents }: ParetoAnalysisProps) {
  const categories = getDowntimeByCategory(downtimeEvents, true)

  if (categories.length === 0) {
    return (
      <EmptyState
        title="Pareto Analysis"
        message="No unplanned downtime events recorded."
        icon={<BarChart3 className="h-5 w-5" />}
      />
    )
  }

  const maxDuration = categories[0]?.totalDurationMinutes || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Pareto Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground font-normal">
          Downtime categories by total time lost (unplanned events only)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => {
            const barWidth = (category.totalDurationMinutes / maxDuration) * 100
            
            return (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={index < PARETO_CATEGORIES.TOP ? 'destructive' : 'secondary'}
                      className="text-xs font-medium"
                    >
                      {category.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {category.eventCount} {category.eventCount === 1 ? 'event' : 'events'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-sm font-semibold">
                        {formatDuration(category.totalDurationMinutes)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {category.percentage.toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bar Chart */}
                <div className="relative w-full h-8 bg-muted rounded-md overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      index < PARETO_CATEGORIES.TOP
                        ? 'bg-red-500 dark:bg-red-600'
                        : index < PARETO_CATEGORIES.SECONDARY
                        ? 'bg-orange-500 dark:bg-orange-600'
                        : 'bg-yellow-500 dark:bg-yellow-600'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                  {/* Cumulative percentage indicator */}
                  {index < categories.length - 1 && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-500 dark:bg-blue-400 opacity-60"
                      style={{ left: `${category.cumulativePercentage}%` }}
                      title={`Cumulative: ${category.cumulativePercentage.toFixed(1)}%`}
                    />
                  )}
                </div>
                
                {/* Cumulative percentage label for top categories */}
                {index < PARETO_CATEGORIES.TOP + 1 && (
                  <div className="text-xs text-muted-foreground">
                    Cumulative: {category.cumulativePercentage.toFixed(1)}%
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Unplanned Downtime:</span>
            <span className="font-semibold">
              {formatDuration(
                categories.reduce((sum, cat) => sum + cat.totalDurationMinutes, 0)
              )}
            </span>
          </div>
          {categories.length >= 2 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Top {PARETO_CATEGORIES.TOP} categories account for{' '}
              <span className="font-medium">
                {categories
                  .slice(0, PARETO_CATEGORIES.TOP)
                  .reduce((sum, cat) => sum + cat.percentage, 0)
                  .toFixed(1)}%
              </span>{' '}
              of total downtime
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

