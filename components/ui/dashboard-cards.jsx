import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Metric Card Component
export function MetricCard({ title, value, change, icon: Icon, trend, className }) {
  const isPositive = trend === 'positive'
  const isNegative = trend === 'negative'
  
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        isPositive && "bg-green-500 dark:bg-green-400",
        isNegative && "bg-red-500 dark:bg-red-400",
        !isPositive && !isNegative && "bg-yellow-500 dark:bg-yellow-400"
      )} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn(
            "text-xs mt-1",
            isPositive && "text-green-600 dark:text-green-400",
            isNegative && "text-red-600 dark:text-red-400",
            !isPositive && !isNegative && "text-muted-foreground"
          )}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Stats Card with Icon
export function StatsCard({ title, description, icon: Icon, children, className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// Product/Feature Card
export function FeatureCard({ title, description, image, badge, action, className }) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-lg", className)}>
      {image && (
        <div className="aspect-video relative bg-muted">
          <img src={image} alt={title} className="object-cover w-full h-full" />
          {badge && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                {badge}
              </span>
            </div>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      {action && (
        <CardContent className="pt-0">
          {action}
        </CardContent>
      )}
    </Card>
  )
}

// Loading Card Skeleton
export function CardSkeleton({ className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>
      </CardContent>
    </Card>
  )
}

// Notification/Alert Card
export function AlertCard({ title, message, type = "info", action, className }) {
  const typeStyles = {
    info: "border-l-blue-500 dark:border-l-blue-400",
    success: "border-l-green-500 dark:border-l-green-400",
    warning: "border-l-yellow-500 dark:border-l-yellow-400",
    error: "border-l-red-500 dark:border-l-red-400"
  }
  
  return (
    <Card className={cn("border-l-4", typeStyles[type], className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        {action}
      </CardContent>
    </Card>
  )
}