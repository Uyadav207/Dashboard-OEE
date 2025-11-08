# OEE Dashboard

A comprehensive React/TypeScript dashboard for visualizing Overall Equipment Effectiveness (OEE) metrics and helping production managers identify their biggest losses.

## Features

### Core Requirements ✅
- **OEE Calculations**: Calculates OEE and its three components (Availability, Performance, Quality) for individual shifts and full day
- **Dashboard Visualization**: 
  - Main OEE display with color coding (Green ≥85%, Yellow 65-85%, Red <65%)
  - Component breakdown showing all three factors as percentages
  - Period comparison with delta vs. previous period
  - Top 3 downtime reasons with duration
- **Lean Manufacturing Standards**: All formulas follow industry-standard OEE calculations

### Extended Features ✅
- **Shift Filter**: Toggle between individual shift views and overall view
- **Trend Indicators**: Week-over-week changes with visual arrows (↑↓)
- **Pareto Analysis**: Visual breakdown of downtime categories by total time lost
- **Mini Chart**: Interactive bar chart showing OEE across shifts using Recharts
- **Export Function**: Download calculations as JSON or CSV

## Setup Instructions

### 🐳 Docker Setup (Recommended)

**Prerequisites:**
- Docker installed and running

**Build and run the application:**
```bash
docker compose up --build
```

The application will be available at `http://localhost:3000`

**Stop the container:**
```bash
docker compose down
```

### 💻 Local Setup

**Prerequisites:**
- Node.js (v20.19.0 or higher recommended)
- npm or yarn package manager

**Installation:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Uyadav207/Dashboard-OEE.git
   cd Dashboard-OEE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The application will be available at `http://localhost:5173` (or the port shown in terminal)

**Build for Production:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

## Architecture Decisions

### Technology Stack

1. **React 19 + TypeScript**
   - Type safety for production data and calculations
   - Component-based architecture for maintainability
   - Modern React hooks for state management

2. **Vite**
   - Fast development server with HMR
   - Optimized production builds
   - Path aliases configured (`@/` → `src/`)

3. **Tailwind CSS**
   - Utility-first CSS for rapid UI development
   - Dark mode support via CSS variables
   - Responsive design built-in

4. **shadcn/ui**
   - Accessible, customizable component library
   - Built on Radix UI primitives
   - Consistent design system

5. **Recharts**
   - Lightweight React charting library
   - Interactive charts with tooltips
   - Responsive and customizable

### Project Structure

```
src/
├── components/
│   ├── oee/                   # OEE-specific components
│   │   ├── OEEDashboard.tsx   # Main dashboard orchestrator
│   │   ├── OEEDisplayCard.tsx # Main OEE display with color coding
│   │   ├── OEEBreakdown.tsx   # Component breakdown (A, P, Q)
│   │   └── index.ts           # Exports all OEE components
│   ├── common/                # Reusable/common components
│   │   ├── EmptyState.tsx     # Reusable empty state component
│   │   ├── TrendIndicator.tsx # Trend arrow component
│   │   ├── ShiftFilter.tsx    # Shift selection filter
│   │   ├── PeriodComparison.tsx # Week-over-week comparison
│   │   ├── ExportButton.tsx   # Export functionality
│   │   ├── TopDowntimeReasons.tsx # Top 3 downtime events
│   │   ├── ParetoAnalysis.tsx # Downtime category analysis
│   │   └── index.ts           # Exports all common components
│   ├── charts/                # Chart components
│   │   ├── OEEMiniChart.tsx   # Bar chart visualization
│   │   ├── ChartTooltip.tsx   # Chart tooltip component
│   │   └── index.ts           # Exports all chart components
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── production.ts          # OEE calculation utilities
│   ├── export.ts              # JSON/CSV export functions
│   ├── utils.ts               # General utilities (formatDuration, getShiftName, cn)
│   └── constants.ts           # Application constants (thresholds, colors)
├── types/
│   ├── production.ts          # TypeScript type definitions
│   └── index.ts               # Exports all types
├── data/
│   ├── production.ts          # Sample production data
│   └── index.ts               # Exports all data
├── App.tsx                    # Root component
└── main.tsx                   # Application entry point
```

### Design Patterns

1. **Separation of Concerns**
   - Business logic in `lib/production.ts` (calculations)
   - UI components in `components/`
   - Type definitions in `types/`
   - Data in `data/`

2. **Component Composition**
   - Small, focused components that compose into larger features
   - Reusable components (TrendIndicator, ExportButton)
   - Props-based data flow

3. **Utility Functions**
   - Pure functions for OEE calculations
   - No side effects in calculation logic
   - Easy to test and maintain

4. **State Management**
   - Local component state for UI interactions (shift filter)
   - Derived state for calculations (OEE metrics computed from props)
   - No global state management needed for current scope

### OEE Calculation Formulas

All calculations follow Lean Manufacturing standards:

- **Availability** = (Operating Time / Planned Production Time)
  - Operating Time = Planned Time - Downtime

- **Performance** = (Actual Quantity / Target Quantity)
  - Capped at 100% (cannot exceed target)

- **Quality** = (Good Quantity / Actual Quantity)
  - Good Quantity = Actual Quantity - Defect Quantity

- **OEE** = Availability × Performance × Quality

## Assumptions

1. **Data Structure**
   - Production data is provided in a structured format with shifts, downtime events, and metadata
   - All time values are in minutes
   - Dates are in ISO 8601 format
   - Previous period data is provided for comparison

2. **OEE Targets**
   - World-Class OEE: ≥ 85%
   - Acceptable OEE: 65-85%
   - Needs Attention: < 65%
   - These thresholds are configurable via metadata

3. **Downtime Analysis**
   - Focus on unplanned downtime for "Top Downtime Reasons" (biggest losses)
   - Planned downtime (maintenance, changeover) is included in calculations but not highlighted as losses
   - Downtime events are linked to specific shifts

4. **Period Comparison**
   - Previous period represents the same day of the previous week
   - Comparison shows absolute delta and percentage change
   - Positive delta indicates improvement

5. **Shift Filtering**
   - When a shift is selected, all metrics are recalculated for that shift only
   - Downtime events are filtered to the selected shift
   - Overall view shows aggregated data across all shifts

6. **Export Functionality**
   - JSON export includes all calculated metrics and raw data
   - CSV export is formatted for easy import into Excel/Google Sheets
   - Filenames include the report date for organization

7. **UI/UX**
   - Color coding follows traffic light system (green/yellow/red)
   - Responsive design works on desktop and tablet
   - Dark mode support via Tailwind CSS variables
   - Interactive tooltips provide additional context

## Development

### Adding New Components

To add shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

### Path Aliases

The project uses path aliases for cleaner imports:
- `@/` → `src/`

Example:
```tsx
import { calculateOEE } from '@/lib/production'
import { Button } from '@/components/ui/button'
```

### TypeScript

All components and utilities are fully typed. Type definitions are in `src/types/production.ts`.


Analyzing the production data to identify the three biggest problems and provide recommendations.


[2 tools called]


## Production Line Analysis

**The 3 Biggest Problems:**

1. **Machine failures (225 minutes, 60% of unplanned downtime)**
   - Hydraulic pump failure (Early Shift, 90 min) and sensor malfunction (Night Shift, 135 min) caused 225 minutes of downtime. This is the primary driver of low availability (70.1%).

2. **Night shift underperformance**
   - Night shift has the lowest performance (80% vs. 90.9% Early, 95.6% Late), highest defect rate (2.7%), and 225 minutes of downtime (machine failure, labor shortage, material shortage). This drags down overall OEE.

3. **Recurring material shortages**
   - Material shortages occurred in Early and Night shifts (60 minutes total), indicating supply chain or inventory management issues that disrupt production flow.

**Recommendations:**

1. **Immediate action on machine reliability**
   - Implement predictive maintenance for hydraulic systems and sensors. Schedule preventive maintenance during planned downtime. Target: reduce machine failures by 50% within 30 days.

2. **Night shift support**
   - Address labor coverage (60-minute shortage suggests staffing gaps). Provide additional training and support. Investigate quality issues (2.7% defect rate). Consider shift rotation or enhanced supervision.

3. **Material management**
   - Review inventory levels and supplier delivery schedules. Implement kanban or automated reorder points. Establish buffer stock for critical components.

**Current OEE: 61.1%** (below the 65% acceptable threshold). Focus on machine reliability first; it will have the largest impact on availability and overall OEE.