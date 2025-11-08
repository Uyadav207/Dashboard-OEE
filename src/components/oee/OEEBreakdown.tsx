import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatOEEAsPercentage } from '@/lib/production'
import type { OEEMetrics } from '@/types/production'
import { TrendIndicator } from '@/components/common'

interface OEEBreakdownProps {
  metrics: OEEMetrics
  previousMetrics: OEEMetrics
}

export function OEEBreakdown({ metrics, previousMetrics }: OEEBreakdownProps) {
  const components = [
    {
      label: 'Availability',
      value: metrics.availability,
      previousValue: previousMetrics.availability,
      description: 'Operating Time / Planned Production Time'
    },
    {
      label: 'Performance',
      value: metrics.performance,
      previousValue: previousMetrics.performance,
      description: 'Actual Quantity / Target Quantity'
    },
    {
      label: 'Quality',
      value: metrics.quality,
      previousValue: previousMetrics.quality,
      description: 'Good Quantity / Actual Quantity'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {components.map((component) => (
          <div key={component.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{component.label}</div>
                <div className="text-sm text-muted-foreground">
                  {component.description}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-lg font-semibold">
                  {formatOEEAsPercentage(component.value)}
                </div>
                <TrendIndicator
                  current={component.value}
                  previous={component.previousValue}
                  size="sm"
                />
              </div>
            </div>
            <Progress value={component.value * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

