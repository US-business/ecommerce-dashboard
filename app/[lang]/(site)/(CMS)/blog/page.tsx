import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Button } from "@/components/shadcnUI/button"
import { Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.cms.blog.title} | متجر إلكتروني`,
    description: dictionary.cms.blog.description,
  }
}

export default async function BlogPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Mock blog posts - in a real app, this would come from a CMS or database
  const blogPosts = [
    {
      id: 1,
      title: dir === "rtl" ? "كيفية اختيار المنتج المناسب" : "How to Choose the Right Product",
      excerpt: dir === "rtl"
        ? "دليل شامل لمساعدتك في اختيار المنتجات المناسبة لاحتياجاتك مع نصائح من خبراء التسوق"
        : "A comprehensive guide to help you choose the right products for your needs with tips from shopping experts",
      author: dir === "rtl" ? "سارة أحمد" : "Sarah Ahmed",
      date: "2024-01-15",
      readTime: "5 دقائق",
      category: dir === "rtl" ? "نصائح التسوق" : "Shopping Tips",
      featured: true
    },
    {
      id: 2,
      title: dir === "rtl" ? "أحدث اتجاهات الموضة لعام 2024" : "Latest Fashion Trends for 2024",
      excerpt: dir === "rtl"
        ? "اكتشف أحدث اتجاهات الموضة والأزياء التي ستسيطر على عام 2024"
        : "Discover the latest fashion and style trends that will dominate 2024",
      author: dir === "rtl" ? "محمد علي" : "Mohamed Ali",
      date: "2024-01-10",
      readTime: "7 دقائق",
      category: dir === "rtl" ? "الموضة" : "Fashion",
      featured: false
    },
    {
      id: 3,
      title: dir === "rtl" ? "دليل شامل للعناية بالأجهزة الإلكترونية" : "Complete Guide to Electronics Care",
      excerpt: dir === "rtl"
        ? "كيفية الحفاظ على أجهزتك الإلكترونية وإطالة عمرها الافتراضي"
        : "How to maintain your electronic devices and extend their lifespan",
      author: dir === "rtl" ? "فاطمة حسن" : "Fatima Hassan",
      date: "2024-01-08",
      readTime: "6 دقائق",
      category: dir === "rtl" ? "التقنية" : "Technology",
      featured: false
    }
  ]

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2">
            {dir === "rtl" ? "مدونتنا" : "Our Blog"}
          </Badge>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          {dictionary.cms.blog.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.cms.blog.description}
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <Card className="mb-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-primary text-white">
                {dir === "rtl" ? "مقال مميز" : "Featured"}
              </Badge>
              <Badge variant="outline">
                {featuredPost.category}
              </Badge>
            </div>
            <CardTitle className="text-2xl md:text-3xl hover:text-primary transition-colors cursor-pointer">
              {featuredPost.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {featuredPost.excerpt}
            </p>

            <div className={cn(
              "flex items-center gap-6 text-sm text-muted-foreground mb-6",
              dir === "rtl" ? "flex-row-reverse" : "flex-row"
            )}>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{featuredPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(featuredPost.date).toLocaleDateString(dir === "rtl" ? "ar-SA" : "en-US")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>

            <Button className="group">
              {dir === "rtl" ? "اقرأ المزيد" : "Read More"}
              <ArrowRight className={cn(
                "w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform",
                dir === "rtl" && "ml-2 mr-0 group-hover:-translate-x-1"
              )} />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts Grid */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
        dir === "rtl" ? "grid-cols-1" : "grid-cols-1"
      )}>
        {regularPosts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className={cn(
                "flex items-center gap-4 text-sm text-muted-foreground mb-4",
                dir === "rtl" ? "flex-row-reverse" : "flex-row"
              )}>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.date).toLocaleDateString(dir === "rtl" ? "ar-SA" : "en-US")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="group/btn">
                {dir === "rtl" ? "اقرأ المزيد" : "Read More"}
                <ArrowRight className={cn(
                  "w-3 h-3 mr-1 group-hover/btn:translate-x-1 transition-transform",
                  dir === "rtl" && "ml-1 mr-0 group-hover/btn:-translate-x-1"
                )} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Subscription */}
      <Card className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {dir === "rtl" ? "اشترك في مدونتنا" : "Subscribe to Our Blog"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {dir === "rtl"
              ? "احصل على أحدث المقالات والنصائح مباشرة في بريدك الإلكتروني"
              : "Get the latest articles and tips directly in your email"
            }
          </p>
          <div className={cn(
            "flex flex-col sm:flex-row gap-3 max-w-md mx-auto",
            dir === "rtl" ? "flex-row-reverse" : "flex-row"
          )}>
            <input
              type="email"
              placeholder={dir === "rtl" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button className="bg-primary hover:bg-primary/90 px-6">
              {dir === "rtl" ? "اشتراك" : "Subscribe"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
