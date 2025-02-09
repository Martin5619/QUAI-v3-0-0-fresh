import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

// Initialize Stripe only if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null

export const PLANS_v2414 = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    features: {
      projectsLimit: 1,
      membersPerProject: 3,
      translationMemory: false,
      glossary: false,
      qaTools: false,
      analytics: false,
      supportLevel: "community",
    },
    stripePriceId: null, // Free plan has no price ID
  },
  PRO: {
    id: "pro",
    name: "Professional",
    price: 49,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      projectsLimit: 10,
      membersPerProject: 10,
      translationMemory: true,
      glossary: true,
      qaTools: true,
      analytics: true,
      supportLevel: "priority",
    },
  },
  ENTERPRISE: {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: {
      projectsLimit: -1, // unlimited
      membersPerProject: -1, // unlimited
      translationMemory: true,
      glossary: true,
      qaTools: true,
      analytics: true,
      supportLevel: "dedicated",
      customFeatures: true,
      sla: true,
    },
  },
}

export type PlanId_v2414 = keyof typeof PLANS_v2414

interface SubscriptionData_v2414 {
  planId: PlanId_v2414
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  status: "active" | "canceled" | "past_due" | "incomplete"
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export async function createSubscription_v2414(
  userId: string,
  planId: PlanId_v2414,
  paymentMethodId?: string
) {
  if (!stripe) {
    throw new Error("Stripe is not configured")
  }

  const user = await prisma.user_v2414.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })

  if (!user) throw new Error("User not found")

  // For free plan, just create subscription record
  if (planId === "FREE") {
    return prisma.subscription_v2414.create({
      data: {
        userId,
        planId,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    })
  }

  // For paid plans, handle Stripe integration
  const plan = PLANS_v2414[planId]
  if (!plan.stripePriceId) throw new Error("Invalid plan")

  let stripeCustomerId = user.subscription?.stripeCustomerId

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: {
        userId: user.id,
      },
    })
    stripeCustomerId = customer.id
  }

  if (paymentMethodId) {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    })
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })
  }

  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: plan.stripePriceId }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  })

  return prisma.subscription_v2414.create({
    data: {
      userId,
      planId,
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })
}

export async function updateSubscription_v2414(
  userId: string,
  planId: PlanId_v2414
) {
  if (!stripe) {
    throw new Error("Stripe is not configured")
  }

  const user = await prisma.user_v2414.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })

  if (!user?.subscription) throw new Error("No active subscription")

  const currentPlan = PLANS_v2414[user.subscription.planId]
  const newPlan = PLANS_v2414[planId]

  // Handle upgrade/downgrade to/from free plan
  if (planId === "FREE" || user.subscription.planId === "FREE") {
    if (user.subscription.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId)
    }

    return prisma.subscription_v2414.update({
      where: { userId },
      data: {
        planId,
        status: "active",
        stripeSubscriptionId: null,
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })
  }

  // Handle paid plan changes
  if (!user.subscription.stripeSubscriptionId) {
    throw new Error("No Stripe subscription found")
  }

  const subscription = await stripe.subscriptions.retrieve(
    user.subscription.stripeSubscriptionId
  )

  await stripe.subscriptions.update(subscription.id, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPlan.stripePriceId,
      },
    ],
    proration_behavior: "always_invoice",
  })

  return prisma.subscription_v2414.update({
    where: { userId },
    data: {
      planId,
    },
  })
}

export async function cancelSubscription_v2414(userId: string) {
  if (!stripe) {
    throw new Error("Stripe is not configured")
  }

  const subscription = await prisma.subscription_v2414.findUnique({
    where: { userId },
  })

  if (!subscription) throw new Error("No active subscription")

  if (subscription.stripeSubscriptionId) {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })
  }

  return prisma.subscription_v2414.update({
    where: { userId },
    data: {
      cancelAtPeriodEnd: true,
    },
  })
}

export async function reactivateSubscription_v2414(userId: string) {
  if (!stripe) {
    throw new Error("Stripe is not configured")
  }

  const subscription = await prisma.subscription_v2414.findUnique({
    where: { userId },
  })

  if (!subscription) throw new Error("No active subscription")

  if (subscription.stripeSubscriptionId) {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    })
  }

  return prisma.subscription_v2414.update({
    where: { userId },
    data: {
      cancelAtPeriodEnd: false,
    },
  })
}

export async function getSubscriptionStatus_v2414(userId: string) {
  if (!stripe) {
    return {
      planId: "FREE" as PlanId_v2414,
      status: "active" as const,
      features: PLANS_v2414.FREE.features,
    }
  }

  const subscription = await prisma.subscription_v2414.findUnique({
    where: { userId },
  })

  if (!subscription) {
    return {
      planId: "FREE" as PlanId_v2414,
      status: "active" as const,
      features: PLANS_v2414.FREE.features,
    }
  }

  return {
    ...subscription,
    features: PLANS_v2414[subscription.planId].features,
  }
}

export async function checkSubscriptionLimits_v2414(userId: string) {
  const subscription = await getSubscriptionStatus_v2414(userId)
  const plan = PLANS_v2414[subscription.planId]

  const [projectCount, memberCounts] = await Promise.all([
    prisma.translationProject_v2414.count({
      where: { createdBy: userId },
    }),
    prisma.projectMember_v2414.groupBy({
      by: ["projectId"],
      where: {
        project: {
          createdBy: userId,
        },
      },
      _count: true,
    }),
  ])

  const maxMembersInProject = Math.max(
    0,
    ...memberCounts.map((count) => count._count)
  )

  return {
    projectsLimit: {
      limit: plan.features.projectsLimit,
      used: projectCount,
      remaining:
        plan.features.projectsLimit === -1
          ? -1
          : Math.max(0, plan.features.projectsLimit - projectCount),
    },
    membersPerProjectLimit: {
      limit: plan.features.membersPerProject,
      maxUsed: maxMembersInProject,
      remaining:
        plan.features.membersPerProject === -1
          ? -1
          : Math.max(0, plan.features.membersPerProject - maxMembersInProject),
    },
    features: plan.features,
  }
}
