import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ReviewStepProps {
  data: {
    name: string
    role: string
    preferences: Record<string, any>
    plan: string
  }
  onUpdate: (data: any) => void
}

const roleLabels: Record<string, string> = {
  PERSONAL_USER: "Personal User",
  STUDENT: "Student",
  TEACHER: "Teacher",
  INSTITUTION: "Institution",
  CORPORATE_USER: "Corporate User",
  LEARNING_MANAGER: "Learning Manager",
  SUPER_ADMIN: "Administrator",
}

export function ReviewStep({ data }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Review Your Choices</h1>
        <p className="text-xl text-muted-foreground">
          Please review your selections before continuing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-muted-foreground">{data.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <p className="text-muted-foreground">{roleLabels[data.role] || data.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Plan</label>
            <p className="text-muted-foreground capitalize">{data.plan}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Your selected preferences and settings</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(data.preferences || {}).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="text-sm font-medium capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <p className="text-muted-foreground">
                {typeof value === "boolean"
                  ? value
                    ? "Yes"
                    : "No"
                  : value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
