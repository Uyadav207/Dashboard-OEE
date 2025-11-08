import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatOEEAsPercentage, calculatePeriodDelta, formatDelta } from '@/lib/production'
import type { OEEMetrics } from '@/types/production'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface PeriodComparisonProps {
  current: OEEMetrics
  previous: OEEMetrics
}

export function PeriodComparison({ current, previous }: PeriodComparisonProps) {
  const comparisons = [
    {
      label: 'Total OEE',
      current: current.totalOEE,
      previous: previous.totalOEE,
      format: formatOEEAsPercentage
    },
    {
      label: 'Availability',
      current: current.availability,
      previous: previous.availability,
      format: formatOEEAsPercentage
    },
    {
      label: 'Performance',
      current: current.performance,
      previous: previous.performance,
      format: formatOEEAsPercentage
    },
    {
      label: 'Quality',
      current: current.quality,
      previous: previous.quality,
      format: formatOEEAsPercentage
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week-over-Week Comparison</CardTitle>
        <p className="text-sm text-muted-foreground font-normal">
          {previous.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comparisons.map((comparison) => {
            const delta = calculatePeriodDelta(comparison.current, comparison.previous)
            const formattedDelta = formatDelta(delta.delta, true)
            
            return (
              <div
                key={comparison.label}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="font-medium">{comparison.label}</div>
                  <div className="text-sm text-muted-foreground">
                    Previous: {comparison.format(comparison.previous)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-semibold">
                      {comparison.format(comparison.current)}
                    </div>
                    <div className={`text-sm ${formattedDelta.colorClass} flex items-center gap-1`}>
                      {delta.isImprovement ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {formattedDelta.value}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

