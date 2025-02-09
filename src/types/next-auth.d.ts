import 'next-auth'
import { Usage_v2414, Subscription_v2414 } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      plan: string
      usage_v2414: Usage_v2414 | null
      subscription_v2414: Subscription_v2414 | null
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    plan: string
    usage_v2414: Usage_v2414 | null
    subscription_v2414: Subscription_v2414 | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string
    role: string
    plan: string
    usage_v2414: Usage_v2414 | null
    subscription_v2414: Subscription_v2414 | null
  }
}
