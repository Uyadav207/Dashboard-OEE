import { useState } from 'react'
import { calculateOverallOEE, calculateShiftOEE } from '@/lib/production'
import type { ProductionData } from '@/types/production'
import { OEEDisplayCard } from './OEEDisplayCard'
import { OEEBreakdown } from './OEEBreakdown'
import {
  PeriodComparison,
  TopDowntimeReasons,
  ParetoAnalysis,
  ShiftFilter,
  ExportButton
} from '@/components/common'
import { OEEMiniChart } from '@/components/charts'
import { Separator } from '@/components/ui/separator'

interface OEEDashboardProps {
  data: ProductionData
}

export function OEEDashboard({ data }: OEEDashboardProps) {
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null)

  // Calculate OEE based on selected shift
  const getCurrentOEE = () => {
    if (!selectedShiftId) {
      return calculateOverallOEE(data.shifts, data.downtimeEvents)
    }
    const selectedShift = data.shifts.find((s) => s.id === selectedShiftId)
    return selectedShift
      ? calculateShiftOEE(selectedShift, data.downtimeEvents)
      : calculateOverallOEE(data.shifts, data.downtimeEvents)
  }

  const currentOEE = getCurrentOEE()

  // Filter downtime events based on selected shift
  const filteredDowntimeEvents = selectedShiftId
    ? data.downtimeEvents.filter((event) => event.shiftId === selectedShiftId)
    : data.downtimeEvents

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h1 className="text-3xl font-bold tracking-tight">OEE Dashboard</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Site:</span> {data.metadata.site}
                </div>
                <div>
                  <span className="font-medium">Department:</span> {data.metadata.department}
                </div>
                <div>
                  <span className="font-medium">Line:</span> {data.productionLine.name}
                </div>
                <div>
                  <span className="font-medium">Report Date:</span> {data.metadata.reportDate}
                </div>
              </div>
            </div>
            <ExportButton data={data} />
          </div>
          
          {/* Shift Filter */}
          <ShiftFilter
            shifts={data.shifts}
            selectedShiftId={selectedShiftId}
            onShiftChange={setSelectedShiftId}
          />
        </div>

        <Separator />

        {/* Main OEE Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OEEDisplayCard
            metrics={currentOEE}
            previousMetrics={data.previousPeriod}
            metadata={data.metadata}
          />
          <OEEBreakdown
            metrics={currentOEE}
            previousMetrics={data.previousPeriod}
          />
        </div>

        {/* Period Comparison and Top Downtime */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PeriodComparison current={currentOEE} previous={data.previousPeriod} />
          <TopDowntimeReasons
            downtimeEvents={filteredDowntimeEvents}
            shifts={data.shifts}
          />
        </div>

        {/* Mini Chart - OEE by Shift */}
        <OEEMiniChart
          shifts={data.shifts}
          downtimeEvents={data.downtimeEvents}
          metadata={data.metadata}
          showComponents={false}
        />

        {/* Pareto Analysis */}
        <ParetoAnalysis downtimeEvents={filteredDowntimeEvents} />
      </div>
    </div>
  )
}

