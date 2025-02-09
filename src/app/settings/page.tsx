import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/settings/profile-form"
import { AccountForm } from "@/components/settings/account-form"
import { NotificationsForm } from "@/components/settings/notifications-form"
import { TranslationPreferencesForm } from "@/components/settings/translation-preferences-form"
import { SubscriptionForm } from "@/components/settings/subscription-form"
import { getUserSettings_v2414 } from "@/lib/services/user-settings-service"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")

  const settings = await getUserSettings_v2414(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account settings and preferences."
      />
      <Separator />
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="translation">Translation</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm
            userId={session.user.id}
            defaultValues={settings.profile}
          />
        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          <AccountForm
            userId={session.user.id}
            defaultValues={{
              language: settings.profile.language,
              timezone: settings.profile.timezone,
            }}
          />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsForm
            userId={session.user.id}
            defaultValues={settings.preferences?.emailNotifications}
          />
        </TabsContent>
        <TabsContent value="translation" className="space-y-4">
          <TranslationPreferencesForm
            userId={session.user.id}
            defaultValues={settings.preferences?.translationPreferences}
          />
        </TabsContent>
        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionForm
            userId={session.user.id}
            subscription={settings.subscription}
          />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
