import { getUser } from "@/lib/actions/users"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import {
  UserViewHeader,
  UserBasicInfo,
  UserContactInfo,
  UserAccountDetails,
} from "./_components"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { AlertCircle } from "lucide-react"
import { notFound } from "next/navigation"

export default async function UserViewPage({
  params
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const resolvedParams = await params
  const lang = resolvedParams?.lang as Locale
  const userId = Number.parseInt(resolvedParams.id)
  const dictionary = await getDictionary(lang)

  // Validate user ID
  if (isNaN(userId)) {
    notFound()
  }

  // Fetch user with error handling
  const userResult = await getUser(userId)

  // Error state
  if (!userResult.success || !userResult.data) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">
                  {lang === 'ar' ? 'خطأ في تحميل المستخدم' : 'Error Loading User'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userResult.error || (lang === 'ar' ? 'لم يتم العثور على المستخدم' : 'User not found')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = userResult.data

  return (
    <div className="space-y-6">
      <UserViewHeader username={user.username} userId={user.id} />

      <div className="grid gap-6 md:grid-cols-2">
        <UserBasicInfo username={user.username} role={user.role} />
        <UserContactInfo
          email={user.email}
          phoneNumber={user.phoneNumber}
          address={user.address}
          createdAt={user.createdAt}
        />
      </div>

      <UserAccountDetails username={user.username} email={user.email} role={user.role} />
    </div>
  )
}
