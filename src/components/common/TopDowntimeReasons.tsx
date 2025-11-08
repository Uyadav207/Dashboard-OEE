import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTopDowntimeReasons } from '@/lib/production'
import { formatDuration, getShiftName } from '@/lib/utils'
import type { DowntimeEvent, Shift } from '@/types/production'
import { AlertTriangle } from 'lucide-react'
import { EmptyState } from './EmptyState'

interface TopDowntimeReasonsProps {
  downtimeEvents: DowntimeEvent[]
  shifts: Shift[]
}

export function TopDowntimeReasons({
  downtimeEvents,
  shifts
}: TopDowntimeReasonsProps) {
  const topReasons = getTopDowntimeReasons(downtimeEvents, 3, true)

  if (topReasons.length === 0) {
    return (
      <EmptyState
        title="Top Downtime Reasons"
        message="No unplanned downtime events recorded."
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Downtime Reasons</CardTitle>
        <p className="text-sm text-muted-foreground font-normal">
          Top 3 unplanned downtime events by duration
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topReasons.map((reason, index) => (
            <div
              key={`${reason.category}-${reason.reason}-${index}`}
              className="flex items-start justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {reason.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getShiftName(shifts, reason.shiftId)}
                    </Badge>
                  </div>
                  <div className="font-medium">{reason.reason}</div>
                  {reason.eventCount > 1 && (
                    <div className="text-xs text-muted-foreground">
                      {reason.eventCount} events
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {formatDuration(reason.totalDurationMinutes)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {reason.totalDurationMinutes} min
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

