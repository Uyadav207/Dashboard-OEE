/**
 * Application Constants
 * Centralized constants for easy maintenance and configuration
 */

// OEE Thresholds
export const OEE_THRESHOLDS = {
  WORLD_CLASS: 0.85,
  ACCEPTABLE: 0.65,
} as const

// Pareto Analysis Categories
export const PARETO_CATEGORIES = {
  TOP: 2,        // Top 2 categories highlighted
  SECONDARY: 4,  // Secondary categories (3-4)
} as const

// Chart Colors
export const CHART_COLORS = {
  GREEN: '#22c55e',   // World-class OEE
  YELLOW: '#eab308',  // Acceptable OEE
  RED: '#ef4444',     // Needs attention
  BLUE: '#3b82f6',    // Availability
  PURPLE: '#a855f7',  // Performance
  CYAN: '#06b6d4',    // Quality
} as const

