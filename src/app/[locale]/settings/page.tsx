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
import { useTranslations } from "next-intl"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")

  const settings = await getUserSettings_v2414(session.user.id)
  const t = useTranslations("settings")

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t("title")}
        text={t("subtitle")}
      />
      <Separator />
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t("tabs.profile")}</TabsTrigger>
          <TabsTrigger value="account">{t("tabs.account")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="translation">{t("tabs.translation")}</TabsTrigger>
          <TabsTrigger value="subscription">{t("tabs.subscription")}</TabsTrigger>
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
