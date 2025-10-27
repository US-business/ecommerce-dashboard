import { getCategories } from "@/lib/actions/categories"
import { SearchBarClient } from "./_components/SearchBarClient"

/**
 * SearchBar Server Component
 * جلب الفئات من السيرفر وتمريرها للـ client component
 */
export async function SearchBar() {
  let categories: any[] | undefined

  try {
    const res = await getCategories()
    if (res?.success) {
      categories = res.data as any[]
    }
  } catch (err) {
    console.error("Error fetching categories:", err)
    categories = undefined
  }

  return <SearchBarClient categories={categories} />
}
































