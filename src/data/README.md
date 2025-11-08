# Production Data

This directory contains production line data including shifts, downtime events, and OEE metrics.

## Structure

- `production.ts` - Production data including:
  - Production line information
  - Shift data (Early, Late, Night shifts)
  - Downtime events
  - OEE metrics for previous period
  - Metadata (site, department, targets)

## Usage

```tsx
import { productionData } from '@/data'
import type { ProductionData, Shift, DowntimeEvent } from '@/types'

// Access production line info
const { productionLine } = productionData

// Access shifts
const shifts = productionData.shifts

// Access downtime events
const downtimeEvents = productionData.downtimeEvents

// Access metadata
const { metadata } = productionData
```

## Related Files

- Types: `src/types/production.ts`
- Utilities: `src/lib/production.ts`

