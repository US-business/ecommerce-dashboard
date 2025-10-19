

import { getUserOrders } from "@/lib/actions/orders";
import { redirect } from "next/navigation"
import { UserOrders } from "./_components/UserOrders";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config"
import { getNextAuthUser } from "@/lib/auth/guards";

export default async function UserOrdersPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang as Locale

    const dictionary = await getDictionary(lang);

    const user = await getNextAuthUser()

    if (!user || !user.id) {
        redirect(`/${lang}/signin`)
    }

    const orders = await getUserOrders(user.id)






    return (
        <div className="container min-h-screen mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{dictionary.account.orders.title}</h1>
                <p className="text-muted-foreground mt-2">{dictionary.account.orders.description}</p>
            </div>
            <UserOrders orders={orders} dictionary={dictionary} lang={lang} />
        </div>
    );
}
