import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateShiftOEE, formatOEEAsPercentage } from '@/lib/production'
import { CHART_COLORS } from '@/lib/constants'
import type { Shift, DowntimeEvent, ProductionMetadata } from '@/types/production'
import { BarChart3 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

interface OEEMiniChartProps {
  shifts: Shift[]
  downtimeEvents: DowntimeEvent[]
  metadata: ProductionMetadata
  showComponents?: boolean
}

export function OEEMiniChart({
  shifts,
  downtimeEvents,
  metadata,
  showComponents = false
}: OEEMiniChartProps) {
  // Calculate OEE for each shift
  const chartData = shifts.map((shift) => {
    const metrics = calculateShiftOEE(shift, downtimeEvents)
    return {
      name: shift.name,
      shiftId: shift.id,
      OEE: Math.round(metrics.totalOEE * 100) / 100,
      OEEPercent: metrics.totalOEE * 100,
      Availability: Math.round(metrics.availability * 100) / 100,
      Performance: Math.round(metrics.performance * 100) / 100,
      Quality: Math.round(metrics.quality * 100) / 100,
      AvailabilityPercent: metrics.availability * 100,
      PerformancePercent: metrics.performance * 100,
      QualityPercent: metrics.quality * 100
    }
  })

  const getBarColor = (oee: number): string => {
    if (oee >= metadata.worldClassOEETarget) {
      return CHART_COLORS.GREEN
    }
    if (oee >= metadata.minimumAcceptableOEE) {
      return CHART_COLORS.YELLOW
    }
    return CHART_COLORS.RED
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          OEE by Shift
        </CardTitle>
        <p className="text-sm text-muted-foreground font-normal">
          {showComponents
            ? 'OEE and component breakdown across shifts'
            : 'OEE performance across all shifts'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={showComponents ? 350 : 300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis
                domain={[0, 100]}
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                label={{
                  value: 'Percentage (%)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'currentColor' }
                }}
              />
              <Tooltip content={<ChartTooltip showComponents={showComponents} />} />
              {showComponents && <Legend />}
              <ReferenceLine
                y={metadata.worldClassOEETarget * 100}
                stroke={CHART_COLORS.GREEN}
                strokeDasharray="5 5"
                label={{
                  value: 'World-Class Target',
                  position: 'top',
                  fill: CHART_COLORS.GREEN,
                  fontSize: 12
                }}
              />
              {showComponents ? (
                <>
                  <Bar
                    dataKey="AvailabilityPercent"
                    name="Availability"
                    fill={CHART_COLORS.BLUE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="PerformancePercent"
                    name="Performance"
                    fill={CHART_COLORS.PURPLE}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="QualityPercent"
                    name="Quality"
                    fill={CHART_COLORS.CYAN}
                    radius={[4, 4, 0, 0]}
                  />
                </>
              ) : (
                <Bar
                  dataKey="OEEPercent"
                  name="OEE"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.OEE)} />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          {!showComponents && (
            <div className="pt-4 border-t">
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span>≥ {formatOEEAsPercentage(metadata.worldClassOEETarget)} (World-Class)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-500" />
                  <span>
                    {formatOEEAsPercentage(metadata.minimumAcceptableOEE)} -{' '}
                    {formatOEEAsPercentage(metadata.worldClassOEETarget)} (Acceptable)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span>
                    &lt; {formatOEEAsPercentage(metadata.minimumAcceptableOEE)} (Needs Attention)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

