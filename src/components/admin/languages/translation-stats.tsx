import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TranslationStatsProps_v2414 {
  title: string
  value: string
  description: string
  percentage?: number
  showAsWarning?: boolean
}

export const TranslationStats_v2414 = ({
  title,
  value,
  description,
  percentage,
  showAsWarning = false,
}: TranslationStatsProps_v2414) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {percentage !== undefined && (
          <div className="mt-4">
            <Progress
              value={percentage}
              className={showAsWarning ? "bg-yellow-100" : undefined}
              indicatorClassName={
                showAsWarning ? "bg-yellow-500" : undefined
              }
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {percentage}% {showAsWarning ? "remaining" : "complete"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
