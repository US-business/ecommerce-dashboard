

import { getUserOrders } from "@/lib/actions/orders";
import { getCurrentUser } from "@/lib/actions/users";
import AccountPageClient from "./_components/AccountPageClient";
import { type Locale } from "@/lib/i18n/i18n-config"
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { redirect } from "next/navigation"

export default async function AccountPage({ params }: { params: { lang: string } }) {
   const resolvedParams = await params;
   const lang = resolvedParams.lang as Locale;
   const dictionary = await getDictionary(lang);
   const dir = lang === "ar" ? "rtl" : "ltr";
   const session = await getServerSession(authOptions)

   if (!session?.user) {
      redirect(`/${lang}/signin`)
   }

   // Get fresh user data from database
   const userResponse = await getCurrentUser();
   let currentUser = null;

   if (userResponse.success && userResponse.data) {
      currentUser = userResponse.data;
   } else {
      // Fallback to session data if database fails
      currentUser = {
         id: session.user.id || 0,
         username: session.user.username || session.user.name || "",
         email: session.user.email || "",
         image: session.user.image || null,
         role: session.user.role || "viewer" as "super_admin" | "viewer",
         address: null,
         phoneNumber: null,
         createdAt: null,
         updatedAt: null
      }
   }

   const orders = currentUser?.id ? await getUserOrders(currentUser.id) : []

   return (
      <AccountPageClient user={currentUser} dictionary={dictionary} orders={orders} lang={lang} />
   )
}
