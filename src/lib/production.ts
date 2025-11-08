/**
 * Production Utilities
 * Helper functions for calculating OEE metrics and analyzing production data
 */

import type {
  Shift,
  DowntimeEvent,
  OEEMetrics
} from '@/types/production'

/**
 * Calculate Availability for a shift
 * Availability = (Operating Time / Planned Production Time) * 100
 */
export function calculateAvailability(
  plannedTime: number,
  downtimeMinutes: number
): number {
  const operatingTime = plannedTime - downtimeMinutes
  return Math.max(0, Math.min(1, operatingTime / plannedTime))
}

/**
 * Calculate Performance for a shift
 * Performance = (Actual Quantity / Target Quantity) * 100
 */
export function calculatePerformance(
  actualQuantity: number,
  targetQuantity: number
): number {
  return Math.min(1, actualQuantity / targetQuantity)
}

/**
 * Calculate Quality for a shift
 * Quality = (Good Quantity / Actual Quantity) * 100
 */
export function calculateQuality(
  goodQuantity: number,
  actualQuantity: number
): number {
  if (actualQuantity === 0) return 0
  return goodQuantity / actualQuantity
}

/**
 * Calculate OEE for a shift
 * OEE = Availability × Performance × Quality
 */
export function calculateOEE(
  availability: number,
  performance: number,
  quality: number
): number {
  return availability * performance * quality
}

/**
 * Calculate OEE metrics for a shift
 */
export function calculateShiftOEE(
  shift: Shift,
  downtimeEvents: DowntimeEvent[]
): OEEMetrics {
  const shiftDowntime = downtimeEvents
    .filter((event) => event.shiftId === shift.id)
    .reduce((total, event) => total + event.durationMinutes, 0)

  const availability = calculateAvailability(
    shift.plannedProductionTime,
    shiftDowntime
  )
  const performance = calculatePerformance(
    shift.actualQuantity,
    shift.targetQuantity
  )
  const quality = calculateQuality(shift.goodQuantity, shift.actualQuantity)
  const totalOEE = calculateOEE(availability, performance, quality)

  return {
    description: `${shift.name} OEE`,
    totalOEE,
    availability,
    performance,
    quality
  }
}

/**
 * Calculate overall OEE for all shifts
 */
export function calculateOverallOEE(
  shifts: Shift[],
  downtimeEvents: DowntimeEvent[]
): OEEMetrics {
  const totalPlannedTime = shifts.reduce(
    (sum, shift) => sum + shift.plannedProductionTime,
    0
  )
  const totalDowntime = downtimeEvents.reduce(
    (sum, event) => sum + event.durationMinutes,
    0
  )
  const totalTargetQuantity = shifts.reduce(
    (sum, shift) => sum + shift.targetQuantity,
    0
  )
  const totalActualQuantity = shifts.reduce(
    (sum, shift) => sum + shift.actualQuantity,
    0
  )
  const totalGoodQuantity = shifts.reduce(
    (sum, shift) => sum + shift.goodQuantity,
    0
  )

  const availability = calculateAvailability(totalPlannedTime, totalDowntime)
  const performance = calculatePerformance(
    totalActualQuantity,
    totalTargetQuantity
  )
  const quality = calculateQuality(totalGoodQuantity, totalActualQuantity)
  const totalOEE = calculateOEE(availability, performance, quality)

  return {
    description: "Overall OEE",
    totalOEE,
    availability,
    performance,
    quality
  }
}

/**
 * Get downtime events for a specific shift
 */
export function getDowntimeEventsForShift(
  downtimeEvents: DowntimeEvent[],
  shiftId: string
): DowntimeEvent[] {
  return downtimeEvents.filter((event) => event.shiftId === shiftId)
}

/**
 * Get downtime events by category
 */
export function getDowntimeEventsByCategory(
  downtimeEvents: DowntimeEvent[],
  category: DowntimeEvent['category']
): DowntimeEvent[] {
  return downtimeEvents.filter((event) => event.category === category)
}

/**
 * Get downtime events by type (planned/unplanned)
 */
export function getDowntimeEventsByType(
  downtimeEvents: DowntimeEvent[],
  type: DowntimeEvent['type']
): DowntimeEvent[] {
  return downtimeEvents.filter((event) => event.type === type)
}

/**
 * Pareto Analysis: Get downtime aggregated by category
 */
export interface DowntimeByCategory {
  category: DowntimeEvent['category']
  totalDurationMinutes: number
  eventCount: number
  percentage: number
  cumulativePercentage: number
}

export function getDowntimeByCategory(
  downtimeEvents: DowntimeEvent[],
  filterUnplanned: boolean = true
): DowntimeByCategory[] {
  // Filter to unplanned if requested
  const filteredEvents = filterUnplanned
    ? downtimeEvents.filter((event) => event.type === 'unplanned')
    : downtimeEvents

  // Group by category and sum durations
  const grouped = new Map<DowntimeEvent['category'], {
    totalDurationMinutes: number
    eventCount: number
  }>()

  filteredEvents.forEach((event) => {
    const existing = grouped.get(event.category)
    if (existing) {
      existing.totalDurationMinutes += event.durationMinutes
      existing.eventCount += 1
    } else {
      grouped.set(event.category, {
        totalDurationMinutes: event.durationMinutes,
        eventCount: 1
      })
    }
  })

  // Convert to array and sort by duration (descending)
  const categories = Array.from(grouped.entries())
    .map(([category, data]) => ({
      category,
      ...data
    }))
    .sort((a, b) => b.totalDurationMinutes - a.totalDurationMinutes)

  // Calculate total for percentage calculation
  const totalDuration = categories.reduce(
    (sum, cat) => sum + cat.totalDurationMinutes,
    0
  )

  // Calculate percentage and cumulative percentage
  let cumulative = 0
  return categories.map((cat) => {
    const percentage = totalDuration > 0
      ? (cat.totalDurationMinutes / totalDuration) * 100
      : 0
    cumulative += percentage
    return {
      category: cat.category,
      totalDurationMinutes: cat.totalDurationMinutes,
      eventCount: cat.eventCount,
      percentage,
      cumulativePercentage: cumulative
    }
  })
}

/**
 * Format OEE as percentage
 */
export function formatOEEAsPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Get OEE status based on target
 */
export function getOEEStatus(
  oee: number,
  worldClassTarget: number,
  minimumTarget: number
): 'excellent' | 'acceptable' | 'poor' {
  if (oee >= worldClassTarget) return 'excellent'
  if (oee >= minimumTarget) return 'acceptable'
  return 'poor'
}

/**
 * Get top N downtime reasons sorted by duration
 * Groups events by category and sums their durations
 */
export interface TopDowntimeReason {
  category: DowntimeEvent['category']
  reason: string
  totalDurationMinutes: number
  shiftId: string
  eventCount: number
}

export function getTopDowntimeReasons(
  downtimeEvents: DowntimeEvent[],
  limit: number = 3,
  filterUnplanned: boolean = true
): TopDowntimeReason[] {
  // Filter to unplanned if requested
  const filteredEvents = filterUnplanned
    ? downtimeEvents.filter((event) => event.type === 'unplanned')
    : downtimeEvents

  // Group by category and reason, summing durations
  const grouped = new Map<string, {
    category: DowntimeEvent['category']
    reason: string
    totalDurationMinutes: number
    shiftId: string
    eventCount: number
  }>()

  filteredEvents.forEach((event) => {
    const key = `${event.category}|${event.reason}`
    const existing = grouped.get(key)
    
    if (existing) {
      existing.totalDurationMinutes += event.durationMinutes
      existing.eventCount += 1
    } else {
      grouped.set(key, {
        category: event.category,
        reason: event.reason,
        totalDurationMinutes: event.durationMinutes,
        shiftId: event.shiftId,
        eventCount: 1
      })
    }
  })

  // Convert to array, sort by duration (descending), and take top N
  return Array.from(grouped.values())
    .sort((a, b) => b.totalDurationMinutes - a.totalDurationMinutes)
    .slice(0, limit)
}

/**
 * Calculate delta between current and previous period metrics
 */
export interface PeriodDelta {
  current: number
  previous: number
  delta: number
  deltaPercentage: number
  isImprovement: boolean
}

export function calculatePeriodDelta(
  current: number,
  previous: number
): PeriodDelta {
  const delta = current - previous
  const deltaPercentage = previous !== 0 ? (delta / previous) * 100 : 0
  const isImprovement = delta >= 0

  return {
    current,
    previous,
    delta,
    deltaPercentage,
    isImprovement
  }
}

/**
 * Format delta value with proper sign and styling info
 */
export interface FormattedDelta {
  value: string
  sign: '+' | '-' | ''
  isImprovement: boolean
  colorClass: string
}

export function formatDelta(
  delta: number,
  isPercentage: boolean = false
): FormattedDelta {
  const isImprovement = delta >= 0
  const sign = delta > 0 ? '+' : delta < 0 ? '-' : ''
  const absValue = Math.abs(delta)
  
  const value = isPercentage
    ? `${sign}${absValue.toFixed(1)}%`
    : `${sign}${absValue.toFixed(2)}`

  const colorClass = isImprovement
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'

  return {
    value,
    sign: sign as '+' | '-' | '',
    isImprovement,
    colorClass
  }
}

/**
 * Get Tailwind CSS color classes for OEE status
 */
export function getOEEColorClass(
  oee: number,
  worldClassTarget: number,
  minimumTarget: number
): string {
  const status = getOEEStatus(oee, worldClassTarget, minimumTarget)
  
  switch (status) {
    case 'excellent':
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
    case 'acceptable':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
    case 'poor':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800'
  }
}

/**
 * Get human-readable OEE status label
 */
export function getOEEStatusLabel(
  oee: number,
  worldClassTarget: number,
  minimumTarget: number
): string {
  const status = getOEEStatus(oee, worldClassTarget, minimumTarget)
  
  switch (status) {
    case 'excellent':
      return 'World-Class'
    case 'acceptable':
      return 'Acceptable'
    case 'poor':
      return 'Needs Attention'
    default:
      return 'Unknown'
  }
}

