import { Button } from '@/components/ui/button'
import { Download, FileJson, FileSpreadsheet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { exportToJSON, exportToCSV } from '@/lib/export'
import type { ProductionData } from '@/types/production'

interface ExportButtonProps {
  data: ProductionData
}

export function ExportButton({ data }: ExportButtonProps) {
  const handleExportJSON = () => {
    exportToJSON(data)
  }

  const handleExportCSV = () => {
    exportToCSV(data)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

