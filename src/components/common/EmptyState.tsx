import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EmptyStateProps {
  title: string
  message: string
  icon?: React.ReactNode
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={icon ? 'flex items-center gap-2' : ''}>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}

