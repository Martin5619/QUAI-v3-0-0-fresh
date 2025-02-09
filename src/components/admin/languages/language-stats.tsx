import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface LanguageStatsProps_v2414 {
  title: string
  value: string
  description: string
  trend: string
}

export const LanguageStats_v2414 = ({
  title,
  value,
  description,
  trend,
}: LanguageStatsProps_v2414) => {
  const isPositive = trend.startsWith("+")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-2 flex items-center text-xs">
          {isPositive ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span
            className={
              isPositive ? "text-green-500" : "text-red-500"
            }
          >
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
