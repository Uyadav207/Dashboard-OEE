import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Shift } from '@/types/production'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format duration in minutes to human-readable string (e.g., "2h 30m" or "45m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

/**
 * Get shift name by shift ID
 */
export function getShiftName(shifts: Shift[], shiftId: string): string {
  const shift = shifts.find((s) => s.id === shiftId)
  return shift?.name || shiftId
}

