import { SignupForm_v3 } from '@/components/auth/SignupForm_v3'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Get started with QUAi today. No credit card required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm_v3 />
        </CardContent>
      </Card>
    </div>
  )
}
