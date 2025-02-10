import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'

export default function VerifyEmailPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.email className="h-6 w-6" />
            Check your email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent you a verification link. Please check your email to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>
            If you don&apos;t see the email, check your spam folder. The verification link will expire in 24 hours.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
