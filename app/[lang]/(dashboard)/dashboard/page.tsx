import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { Suspense } from "react";
import { DashboardContent } from "./_components/DashboardContent";
import { getDashboardStats } from "@/lib/actions/dashboard";

export default async function Page({
  params
}: {
  params: { lang: string }
}) {
  const params_lang = await Promise.resolve(params.lang);
  const lang = params_lang as Locale;
  const dictionary = await getDictionary(lang);
  const direction = lang === "ar" ? ("rtl" as const) : ("ltr" as const);

  const stats = await getDashboardStats();
  const data = stats.success ? stats.data : null;

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{stats.error || "Failed to load dashboard data"}</p>
      </div>
    );
  }



  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent
        dictionary={dictionary}
        direction={direction}
        data={data}
      />
    </Suspense>
  );
}