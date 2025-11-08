import { Button } from '@/components/ui/button'
import type { Shift } from '@/types/production'
import { cn } from '@/lib/utils'

interface ShiftFilterProps {
  shifts: Shift[]
  selectedShiftId: string | null
  onShiftChange: (shiftId: string | null) => void
}

export function ShiftFilter({
  shifts,
  selectedShiftId,
  onShiftChange
}: ShiftFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">View:</span>
      <Button
        variant={selectedShiftId === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onShiftChange(null)}
        className={cn(
          'transition-colors',
          selectedShiftId === null && 'bg-primary text-primary-foreground'
        )}
      >
        All Shifts
      </Button>
      {shifts.map((shift) => (
        <Button
          key={shift.id}
          variant={selectedShiftId === shift.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onShiftChange(shift.id)}
          className={cn(
            'transition-colors',
            selectedShiftId === shift.id && 'bg-primary text-primary-foreground'
          )}
        >
          {shift.name}
        </Button>
      ))}
    </div>
  )
}

