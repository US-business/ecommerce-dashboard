
"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcnUI/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar"
import { Badge } from "@/components/shadcnUI/badge"
import { Button } from "@/components/shadcnUI/button"
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm"
import { ProfileForm } from "./ProfileForm";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { UserOrders } from "../../user-orders/_components/UserOrders";
import { User } from "@/types/user";
import { cn } from "@/lib/utils"
import { User as UserIcon, Mail, Calendar, Shield, Lock, ArrowLeft, Edit } from "lucide-react"
import { useSession } from "next-auth/react"

type Order = Awaited<ReturnType<typeof import("@/lib/actions/orders").getUserOrders>>[0];

export default function AccountPageClient({
  user,
  dictionary,
  orders,
  lang
}: {
  user: User;
  dictionary: any;
  orders: Order[];
  lang: string
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("profile")
  const [currentUserData, setCurrentUserData] = useState(user)
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false)
  
  // تحديد اتجاه اللغة
  const dir = lang === "ar" ? "rtl" : "ltr"
  
  // دمج بيانات المستخدم مع provider من session
  const currentUser = {
    ...currentUserData,
    provider: (session?.user as any)?.provider || "email"
  }

  // callback لتحديث بيانات المستخدم
  const handleUserUpdate = (updatedUser: any) => {
    setCurrentUserData(prev => ({
      ...prev,
      ...updatedUser
    }));
  }

  // callback لتحديث صورة البروفايل
  const handleImageUpdate = (imageUrl: string) => {
    setCurrentUserData(prev => ({
      ...prev,
      image: imageUrl
    }));
  }

  // Safe fallback dictionary
  const safeDictionary = {
    account: {
      editProfilePhoto: dictionary?.account?.editProfilePhoto || "Edit Profile Photo",
      tabs: {
        profile: dictionary?.account?.tabs?.profile || "Profile",
        orders: dictionary?.account?.tabs?.orders || "Orders",
      },
      profile: {
        title: dictionary?.account?.profile?.title || "Account Information",
        description: dictionary?.account?.profile?.description || "Your personal account information and contact details",
      },
      orders: {
        title: dictionary?.account?.orders?.title || "My Orders", 
        description: dictionary?.account?.orders?.description || "Your order history and current status",
      },
      general: {
        back: dictionary?.account?.general?.back || "Back",
        memberSince: dictionary?.account?.general?.memberSince || "Member since",
        googleAccount: dictionary?.account?.general?.googleAccount || "Google Account",
        localAccount: dictionary?.account?.general?.localAccount || "Local Account",
        security: dictionary?.account?.general?.security || "Security",
        superAdmin: dictionary?.account?.general?.superAdmin || "Super Admin",
        user: dictionary?.account?.general?.user || "User",
        manageGoogleAccount: dictionary?.account?.general?.manageGoogleAccount || "Manage Google Account",
        passwordManagedByGoogle: dictionary?.account?.general?.passwordManagedByGoogle || "Your password is managed through Google. To change your password, please visit your Google account settings.",
        noOrdersYet: dictionary?.account?.general?.noOrdersYet || "No orders yet",
        startShopping: dictionary?.account?.general?.startShopping || "Start Shopping"
      }
    },
    common: {
      edit: dictionary?.common?.edit || "Edit"
    }
  };

  const getRoleText = (role: string) => {
    if (role === "super_admin") {
      return safeDictionary.account.general.superAdmin
    }
    return safeDictionary.account.general.user
  }

  const getRoleBadgeVariant = (role: string) => {
    return role === "super_admin" ? "default" : "secondary"
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* زر العودة */}
        <div className={cn("mb-6", dir === "rtl" ? "text-right" : "text-left")}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}
          >
            <ArrowLeft className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
            {safeDictionary.account.general.back}
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className={cn("flex items-center gap-6", dir === "rtl" && "flex-row-reverse")}>
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser?.image || ""} alt={currentUser?.username || ""} />
                  <AvatarFallback className="text-lg">
                    {getInitials(currentUser?.username || currentUser?.email || "U")}
                  </AvatarFallback>
                </Avatar>

                <div className={cn("flex-1", dir === "rtl" && "text-right")}>
                  <div className={cn("flex items-center gap-3 mb-2", dir === "rtl" && "flex-row-reverse")}>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentUser?.username || "User"}
                    </h1>
                    <Badge variant={getRoleBadgeVariant(currentUser?.role || "viewer")}>
                      {getRoleText(currentUser?.role || "viewer")}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{currentUser?.email}</p>
                  <div className={cn("flex items-center gap-4 text-sm text-gray-500", dir === "rtl" && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-1", dir === "rtl" && "flex-row-reverse")}>
                      <Calendar className="h-4 w-4" />
                      <span>
                        {safeDictionary.account.general.memberSince} {new Date().getFullYear()}
                      </span>
                    </div>
                    <div className={cn("flex items-center gap-1", dir === "rtl" && "flex-row-reverse")}>
                      <Shield className="h-4 w-4" />
                      <span>
                        {currentUser?.provider === "google"
                          ? safeDictionary.account.general.googleAccount
                          : safeDictionary.account.general.localAccount
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsProfileImageModalOpen(true)}
                >
                  <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                    <Edit className="h-4 w-4" />
                    <span>{safeDictionary?.account?.editProfilePhoto}</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                <UserIcon className="h-4 w-4" />
                <span>{safeDictionary.account.tabs.profile}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="security">
              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                <Lock className="h-4 w-4" />
                <span>{safeDictionary.account.general.security}</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="orders">
              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                <Mail className="h-4 w-4" />
                <span>{safeDictionary.account.tabs.orders}</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className={cn(dir === "rtl" && "text-right")}>
                <CardTitle>{safeDictionary.account.profile.title}</CardTitle>
                <CardDescription>
                  {safeDictionary.account.profile.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={currentUserData} dictionary={dictionary} onUpdate={handleUserUpdate} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {currentUser?.provider === "google" ? (
              <Card>
                <CardHeader className={cn(dir === "rtl" && "text-right")}>
                  <CardTitle>{safeDictionary.account.general.googleAccount}</CardTitle>
                  <CardDescription>
                    {safeDictionary.account.general.passwordManagedByGoogle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://myaccount.google.com/security", "_blank")}
                  >
                    {safeDictionary.account.general.manageGoogleAccount}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ChangePasswordForm
                onSuccess={() => {
                  // يمكن إضافة إجراءات إضافية هنا
                  router.refresh()
                }}
              />
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader className={cn(dir === "rtl" && "text-right")}>
                <CardTitle>{safeDictionary.account.orders.title}</CardTitle>
                <CardDescription>
                  {safeDictionary.account.orders.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <UserOrders orders={orders} dictionary={dictionary} lang={lang} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {safeDictionary.account.general.noOrdersYet}
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => router.push(`/${lang}`)}
                    >
                      {safeDictionary.account.general.startShopping}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Profile Image Upload Modal */}
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
