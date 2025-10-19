import { getUsers } from "@/lib/actions/users"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import { UsersClient } from "./_components"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { AlertCircle } from "lucide-react"

export default async function UsersPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const lang = resolvedParams?.lang as Locale
  const dictionary = await getDictionary(lang)

  // Extract search params
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1
  const limit = typeof resolvedSearchParams.limit === 'string' ? parseInt(resolvedSearchParams.limit) : 50

  // Fetch users with error handling
  const usersResult = await getUsers(page, limit, search)

  // Error state
  if (!usersResult.success) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">
                  {lang === 'ar' ? 'خطأ في تحميل المستخدمين' : 'Error Loading Users'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {usersResult.error || (lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const users = usersResult.data || []
  const total = usersResult.total || 0

  return (
    <UsersClient 
      initialUsers={users} 
      dictionary={dictionary}
      totalUsers={total}
    />
  )
}
