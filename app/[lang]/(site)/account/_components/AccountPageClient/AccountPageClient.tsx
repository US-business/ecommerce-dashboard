"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs } from "@/components/shadcnUI/tabs";
import { ProfileImageUpload } from "../ProfileImageUpload/ProfileImageUpload";
import { useSession } from "next-auth/react"
import {
  BackButton,
  AccountHeader,
  AccountTabs,
  ProfileTab,
  SecurityTab,
  OrdersTab,
  getSafeDictionary,
  type AccountPageClientProps
} from "./_components";

export default function AccountPageClient({
  user,
  dictionary,
  orders,
  lang
}: AccountPageClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("profile")
  const [currentUserData, setCurrentUserData] = useState(user)
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false)
  
  const dir = lang === "ar" ? "rtl" : "ltr"
  const safeDictionary = getSafeDictionary(dictionary);
  
  const currentUser = {
    ...currentUserData,
    provider: (session?.user as any)?.provider || "email"
  }

  const handleUserUpdate = (updatedUser: any) => {
    setCurrentUserData(prev => ({
      ...prev,
      ...updatedUser
    }));
  }

  const handleImageUpdate = (imageUrl: string) => {
    setCurrentUserData(prev => ({
      ...prev,
      image: imageUrl
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <BackButton
          text={safeDictionary.account.general.back}
          onBack={() => router.back()}
        />

        <AccountHeader
          currentUser={currentUser}
          safeDictionary={safeDictionary}
          onEditImage={() => setIsProfileImageModalOpen(true)}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <AccountTabs dir={dir} safeDictionary={safeDictionary} />

          <ProfileTab
            currentUserData={currentUserData}
            dir={dir}
            safeDictionary={safeDictionary}
            dictionary={dictionary}
            onUpdate={handleUserUpdate}
          />

          <SecurityTab
            currentUser={currentUser}
            dir={dir}
            safeDictionary={safeDictionary}
            onPasswordChangeSuccess={() => router.refresh()}
          />

          <OrdersTab
            orders={orders}
            dir={dir}
            safeDictionary={safeDictionary}
            dictionary={dictionary}
            lang={lang}
            onStartShopping={() => router.push(`/${lang}`)}
          />
        </Tabs>

        <ProfileImageUpload
          isOpen={isProfileImageModalOpen}
          onOpenChange={setIsProfileImageModalOpen}
          currentImage={currentUser?.image}
          username={currentUser?.username || "User"}
          onImageUpdate={handleImageUpdate}
          lang={lang}
        />
      </div>
    </div>
  );
}
