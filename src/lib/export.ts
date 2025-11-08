/**
 * Export Utilities
 * Functions to export OEE data as JSON or CSV
 */

import type {
  ProductionData,
  DowntimeEvent,
  OEEMetrics
} from '@/types/production'
import {
  calculateShiftOEE,
  calculateOverallOEE,
  getTopDowntimeReasons,
  getDowntimeByCategory
} from './production'

export interface ExportData {
  metadata: {
    site: string
    department: string
    reportDate: string
    productionLine: string
    exportDate: string
    exportTime: string
  }
  overallOEE: OEEMetrics & {
    totalOEEPercent: number
    availabilityPercent: number
    performancePercent: number
    qualityPercent: number
  }
  shifts: Array<{
    id: string
    name: string
    startTime: string
    endTime: string
    plannedProductionTime: number
    targetQuantity: number
    actualQuantity: number
    goodQuantity: number
    defectQuantity: number
    oee: OEEMetrics & {
      totalOEEPercent: number
      availabilityPercent: number
      performancePercent: number
      qualityPercent: number
    }
  }>
  downtimeEvents: DowntimeEvent[]
  topDowntimeReasons: Array<{
    category: string
    reason: string
    totalDurationMinutes: number
    eventCount: number
  }>
  downtimeByCategory: Array<{
    category: string
    totalDurationMinutes: number
    eventCount: number
    percentage: number
  }>
  previousPeriod: OEEMetrics & {
    totalOEEPercent: number
    availabilityPercent: number
    performancePercent: number
    qualityPercent: number
  }
  periodComparison: {
    oee: {
      current: number
      previous: number
      delta: number
      deltaPercent: number
    }
    availability: {
      current: number
      previous: number
      delta: number
      deltaPercent: number
    }
    performance: {
      current: number
      previous: number
      delta: number
      deltaPercent: number
    }
    quality: {
      current: number
      previous: number
      delta: number
      deltaPercent: number
    }
  }
}

/**
 * Prepare export data from production data
 */
export function prepareExportData(data: ProductionData): ExportData {
  const overallOEE = calculateOverallOEE(data.shifts, data.downtimeEvents)
  const topReasons = getTopDowntimeReasons(data.downtimeEvents, 10, true)
  const downtimeByCategory = getDowntimeByCategory(data.downtimeEvents, true)

  // Calculate shift OEEs
  const shiftsWithOEE = data.shifts.map((shift) => {
    const oee = calculateShiftOEE(shift, data.downtimeEvents)
    return {
      ...shift,
      oee: {
        ...oee,
        totalOEEPercent: oee.totalOEE * 100,
        availabilityPercent: oee.availability * 100,
        performancePercent: oee.performance * 100,
        qualityPercent: oee.quality * 100
      }
    }
  })

  // Calculate period comparison
  const calculateDelta = (current: number, previous: number) => {
    const delta = current - previous
    const deltaPercent = previous !== 0 ? (delta / previous) * 100 : 0
    return { delta, deltaPercent }
  }

  const now = new Date()

  return {
    metadata: {
      site: data.metadata.site,
      department: data.metadata.department,
      reportDate: data.metadata.reportDate,
      productionLine: data.productionLine.name,
      exportDate: now.toISOString().split('T')[0],
      exportTime: now.toISOString()
    },
    overallOEE: {
      ...overallOEE,
      totalOEEPercent: overallOEE.totalOEE * 100,
      availabilityPercent: overallOEE.availability * 100,
      performancePercent: overallOEE.performance * 100,
      qualityPercent: overallOEE.quality * 100
    },
    shifts: shiftsWithOEE,
    downtimeEvents: data.downtimeEvents,
    topDowntimeReasons: topReasons.map((r) => ({
      category: r.category,
      reason: r.reason,
      totalDurationMinutes: r.totalDurationMinutes,
      eventCount: r.eventCount
    })),
    downtimeByCategory: downtimeByCategory.map((c) => ({
      category: c.category,
      totalDurationMinutes: c.totalDurationMinutes,
      eventCount: c.eventCount,
      percentage: c.percentage
    })),
    previousPeriod: {
      ...data.previousPeriod,
      totalOEEPercent: data.previousPeriod.totalOEE * 100,
      availabilityPercent: data.previousPeriod.availability * 100,
      performancePercent: data.previousPeriod.performance * 100,
      qualityPercent: data.previousPeriod.quality * 100
    },
    periodComparison: {
      oee: {
        current: overallOEE.totalOEE,
        previous: data.previousPeriod.totalOEE,
        ...calculateDelta(overallOEE.totalOEE, data.previousPeriod.totalOEE)
      },
      availability: {
        current: overallOEE.availability,
        previous: data.previousPeriod.availability,
        ...calculateDelta(overallOEE.availability, data.previousPeriod.availability)
      },
      performance: {
        current: overallOEE.performance,
        previous: data.previousPeriod.performance,
        ...calculateDelta(overallOEE.performance, data.previousPeriod.performance)
      },
      quality: {
        current: overallOEE.quality,
        previous: data.previousPeriod.quality,
        ...calculateDelta(overallOEE.quality, data.previousPeriod.quality)
      }
    }
  }
}

/**
 * Export data as JSON
 */
export function exportToJSON(data: ProductionData, filename?: string): void {
  const exportData = prepareExportData(data)
  const jsonString = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `oee-report-${exportData.metadata.reportDate}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Convert value to CSV-safe string
 */
function csvEscape(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }
  const stringValue = String(value)
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

/**
 * Export data as CSV
 */
export function exportToCSV(data: ProductionData, filename?: string): void {
  const exportData = prepareExportData(data)
  const lines: string[] = []

  // Header
  lines.push('OEE Dashboard Export')
  lines.push(`Report Date: ${exportData.metadata.reportDate}`)
  lines.push(`Export Date: ${exportData.metadata.exportDate}`)
  lines.push(`Site: ${exportData.metadata.site}`)
  lines.push(`Department: ${exportData.metadata.department}`)
  lines.push(`Production Line: ${exportData.metadata.productionLine}`)
  lines.push('')

  // Overall OEE
  lines.push('Overall OEE')
  lines.push('Metric,Value,Percentage')
  lines.push(`Total OEE,${exportData.overallOEE.totalOEE.toFixed(4)},${exportData.overallOEE.totalOEEPercent.toFixed(2)}%`)
  lines.push(`Availability,${exportData.overallOEE.availability.toFixed(4)},${exportData.overallOEE.availabilityPercent.toFixed(2)}%`)
  lines.push(`Performance,${exportData.overallOEE.performance.toFixed(4)},${exportData.overallOEE.performancePercent.toFixed(2)}%`)
  lines.push(`Quality,${exportData.overallOEE.quality.toFixed(4)},${exportData.overallOEE.qualityPercent.toFixed(2)}%`)
  lines.push('')

  // Period Comparison
  lines.push('Period Comparison (Week-over-Week)')
  lines.push('Metric,Current,Previous,Delta,Delta %')
  lines.push(`OEE,${exportData.periodComparison.oee.current.toFixed(4)},${exportData.periodComparison.oee.previous.toFixed(4)},${exportData.periodComparison.oee.delta.toFixed(4)},${exportData.periodComparison.oee.deltaPercent.toFixed(2)}%`)
  lines.push(`Availability,${exportData.periodComparison.availability.current.toFixed(4)},${exportData.periodComparison.availability.previous.toFixed(4)},${exportData.periodComparison.availability.delta.toFixed(4)},${exportData.periodComparison.availability.deltaPercent.toFixed(2)}%`)
  lines.push(`Performance,${exportData.periodComparison.performance.current.toFixed(4)},${exportData.periodComparison.performance.previous.toFixed(4)},${exportData.periodComparison.performance.delta.toFixed(4)},${exportData.periodComparison.performance.deltaPercent.toFixed(2)}%`)
  lines.push(`Quality,${exportData.periodComparison.quality.current.toFixed(4)},${exportData.periodComparison.quality.previous.toFixed(4)},${exportData.periodComparison.quality.delta.toFixed(4)},${exportData.periodComparison.quality.deltaPercent.toFixed(2)}%`)
  lines.push('')

  // Shifts
  lines.push('Shifts')
  lines.push('Shift Name,Start Time,End Time,Planned Time (min),Target Qty,Actual Qty,Good Qty,Defect Qty,OEE %,Availability %,Performance %,Quality %')
  exportData.shifts.forEach((shift) => {
    lines.push(
      [
        csvEscape(shift.name),
        csvEscape(shift.startTime),
        csvEscape(shift.endTime),
        shift.plannedProductionTime,
        shift.targetQuantity,
        shift.actualQuantity,
        shift.goodQuantity,
        shift.defectQuantity,
        shift.oee.totalOEEPercent.toFixed(2),
        shift.oee.availabilityPercent.toFixed(2),
        shift.oee.performancePercent.toFixed(2),
        shift.oee.qualityPercent.toFixed(2)
      ].join(',')
    )
  })
  lines.push('')

  // Top Downtime Reasons
  lines.push('Top Downtime Reasons')
  lines.push('Category,Reason,Duration (min),Event Count')
  exportData.topDowntimeReasons.forEach((reason) => {
    lines.push(
      [
        csvEscape(reason.category),
        csvEscape(reason.reason),
        reason.totalDurationMinutes,
        reason.eventCount
      ].join(',')
    )
  })
  lines.push('')

  // Downtime by Category
  lines.push('Downtime by Category')
  lines.push('Category,Total Duration (min),Event Count,Percentage')
  exportData.downtimeByCategory.forEach((category) => {
    lines.push(
      [
        csvEscape(category.category),
        category.totalDurationMinutes,
        category.eventCount,
        category.percentage.toFixed(2)
      ].join(',')
    )
  })
  lines.push('')

  // Downtime Events
  lines.push('Downtime Events')
  lines.push('ID,Shift ID,Category,Reason,Type,Start Time,End Time,Duration (min)')
  exportData.downtimeEvents.forEach((event) => {
    lines.push(
      [
        csvEscape(event.id),
        csvEscape(event.shiftId),
        csvEscape(event.category),
        csvEscape(event.reason),
        csvEscape(event.type),
        csvEscape(event.startTime),
        csvEscape(event.endTime),
        event.durationMinutes
      ].join(',')
    )
  })

  // Create and download
  const csvString = lines.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `oee-report-${exportData.metadata.reportDate}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

