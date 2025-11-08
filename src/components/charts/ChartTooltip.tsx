interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: {
      name: string
      OEEPercent: number
      AvailabilityPercent?: number
      PerformancePercent?: number
      QualityPercent?: number
    }
  }>
  showComponents?: boolean
}

export function ChartTooltip({ active, payload, showComponents = false }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const data = payload[0].payload

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="font-semibold mb-2">{data.name}</p>
      {showComponents ? (
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">OEE:</span>
            <span className="font-medium">{data.OEEPercent.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-blue-500">Availability:</span>
            <span className="font-medium">{data.AvailabilityPercent?.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-purple-500">Performance:</span>
            <span className="font-medium">{data.PerformancePercent?.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-cyan-500">Quality:</span>
            <span className="font-medium">{data.QualityPercent?.toFixed(1)}%</span>
          </div>
        </div>
      ) : (
        <div className="text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">OEE:</span>
            <span className="font-medium">{data.OEEPercent.toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

