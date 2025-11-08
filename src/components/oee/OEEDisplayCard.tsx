import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatOEEAsPercentage, getOEEColorClass, getOEEStatusLabel } from '@/lib/production'
import type { OEEMetrics, ProductionMetadata } from '@/types/production'
import { TrendIndicator } from '@/components/common'

interface OEEDisplayCardProps {
  metrics: OEEMetrics
  previousMetrics: OEEMetrics
  metadata: ProductionMetadata
}

export function OEEDisplayCard({ metrics, previousMetrics, metadata }: OEEDisplayCardProps) {
  const colorClasses = getOEEColorClass(
    metrics.totalOEE,
    metadata.worldClassOEETarget,
    metadata.minimumAcceptableOEE
  )
  const statusLabel = getOEEStatusLabel(
    metrics.totalOEE,
    metadata.worldClassOEETarget,
    metadata.minimumAcceptableOEE
  )

  return (
    <Card className={`border-2 ${colorClasses}`}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{metrics.description}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-6xl font-bold tracking-tight">
            {formatOEEAsPercentage(metrics.totalOEE)}
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {statusLabel}
            </Badge>
            <TrendIndicator
              current={metrics.totalOEE}
              previous={previousMetrics.totalOEE}
              size="md"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

