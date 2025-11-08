/**
 * Production Line Types
 * Type definitions for production line, shifts, downtime events, and OEE metrics
 */

export interface ProductionLine {
  id: string
  name: string
  targetCycleTime: number
  description: string
}

export interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  plannedProductionTime: number
  targetQuantity: number
  actualQuantity: number
  goodQuantity: number
  defectQuantity: number
}

export type DowntimeCategory =
  | "Machine Failure"
  | "Material Shortage"
  | "Planned Maintenance"
  | "Changeover"
  | "Quality Issue"
  | "Labor Shortage"

export type DowntimeType = "planned" | "unplanned"

export interface DowntimeEvent {
  id: string
  shiftId: string
  category: DowntimeCategory
  reason: string
  startTime: string
  endTime: string
  durationMinutes: number
  type: DowntimeType
}

export interface OEEMetrics {
  description: string
  totalOEE: number
  availability: number
  performance: number
  quality: number
}

export interface ProductionMetadata {
  site: string
  department: string
  reportDate: string
  worldClassOEETarget: number
  minimumAcceptableOEE: number
}

export interface ProductionData {
  productionLine: ProductionLine
  shifts: Shift[]
  downtimeEvents: DowntimeEvent[]
  previousPeriod: OEEMetrics
  metadata: ProductionMetadata
}

