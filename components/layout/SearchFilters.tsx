"use client"

import { RotateCcw, Filter } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Slider } from "@/components/shadcnUI/slider"
import { Input } from "@/components/shadcnUI/input"
import { Switch } from "@/components/shadcnUI/switch"
import { Label } from "@/components/shadcnUI/label"
import { Collapsible } from "@/components/ui/collapsible"
import AsideBar from "@/components/layout/AsideBar"
import { Checkbox } from "@/components/shadcnUI/checkbox"
import { RadioGroup, RadioGroupItem } from "../shadcnUI/radio-group"

type ChooseBrandProps = {
   brands: string[]
   selectedBrands: string[]
   onChange: (brand: string) => void | undefined
}

interface Category {
   id: number
   nameAr: string
   nameEn: string
}

interface CategoryRadioProps {
   categories: Category[] | undefined
   value: string | undefined
   onChange: (value: string) => void | undefined
   locale: string
   defaultValue: string
}

interface SearchFiltersProps {
   classNames?: string
   t: (key: string) => string
   locale: string
   categories?: any[] | undefined
   brands: string[]
   // store state
   sortBy: string
   setSortBy: (v: any) => void
   categoryId?: number
   setCategoryId?: (v: number) => void
   selectedBrands: string[]
   toggleBrand: (brand: string) => void
   priceRange: number[]
   setPriceRange: (v: number[] | any) => void
   inStockOnly: boolean
   setInStockOnly: (v: boolean) => void
   outOfStockOnly: boolean
   setOutOfStockOnly: (v: boolean) => void
   onSaleOnly: boolean
   setOnSaleOnly: (v: boolean) => void
   clearFilters: () => void
}

export default function SearchFilters(props: SearchFiltersProps) {
   const {
      classNames = "",
      t,
      locale,
      categories,
      brands,
      sortBy,
      setSortBy,
      categoryId,
      setCategoryId,
      selectedBrands,
      toggleBrand,
      priceRange,
      setPriceRange,
      inStockOnly,
      setInStockOnly,
      outOfStockOnly,
      setOutOfStockOnly,
      onSaleOnly,
      setOnSaleOnly,
      clearFilters,
   } = props
   console.log(locale);

   return (
      <AsideBar title={t("search.filter")} iconLeft={<Filter className={"h-4 w-4 "} />} className={classNames}>
         {/* Reset */}
         <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-sm flex items-center group mb-4"
         >
            <RotateCcw className="h-3 w-3 mr-1 group-hover:animate-spin " /> Clear All
         </Button>

         {/* Sort */}
         <Collapsible title={t("search.sortBy")}>
            <Select value={sortBy} onValueChange={setSortBy}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("search.sortBy")} />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="newest">{t("search.newest")}</SelectItem>
                  <SelectItem value="oldest">{t("search.oldest")}</SelectItem>
                  <SelectItem value="priceLowHigh">{t("search.priceLowHigh")}</SelectItem>
                  <SelectItem value="priceHighLow">{t("search.priceHighLow")}</SelectItem>
               </SelectContent>
            </Select>
         </Collapsible>

         {/* Categories */}
         {categories &&
            <Collapsible title={t("categories.title")}>
               <ChooseCategory
                  locale={locale}
                  defaultValue={t("search.all")}
                  value={categoryId?.toString()}
                  categories={categories}
                  onChange={(v: any) => setCategoryId && setCategoryId(parseInt(v))}
               />
            </Collapsible>
         }

         {/* Brands */}
         <Collapsible title={t("products.brand")}>
            <ChooseBrand brands={brands} selectedBrands={selectedBrands} onChange={toggleBrand} />
         </Collapsible>

         {/* Price */}
         <Collapsible title={t("products.price")}>
            <div className="px-2 my-4 flex flex-col gap-2">
               <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={0}
                  step={10}
                  className="mb-2"
               />
               <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{priceRange[0]} LE</span>
                  <span>{priceRange[1]} LE</span>
               </div>
               <div className="flex justify-between">
                  <Input
                     type="number"
                     value={priceRange[0]}
                     onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                     className="w-20"
                  />
                  <Input
                     type="number"
                     value={priceRange[1]}
                     onChange={(e: any) => setPriceRange([priceRange[0], Number(e.target.value)])}
                     className="w-20"
                  />
               </div>
            </div>
         </Collapsible>

         {/* Availability */}
         <Collapsible title={t("search.availability")}>
            <div className="flex flex-col gap-4 mb-4">
               <div className={`flex items-center justify-between w-full`}>
                  <Label htmlFor="onSaleOnly">{t("search.onSale")}</Label>
                  <Switch
                     id="onSaleOnly"
                     checked={onSaleOnly}
                     onCheckedChange={setOnSaleOnly}
                  />
               </div>
               <div className="flex items-center justify-between w-full">
                  <Label htmlFor="inStockOnly">{t("search.inStock")}</Label>
                  <Switch
                     // dir={locale === "ar" ? "ltr" : locale === "en" ? "rtl" : "ltr"}
                     id="inStockOnly"
                     checked={inStockOnly}
                     onCheckedChange={(val) => {
                        setInStockOnly(val)
                        if (val) setOutOfStockOnly(false)
                     }}
                  />
               </div>
               <div className="flex items-center justify-between w-full">
                  <Label htmlFor="outOfStockOnly">{t("search.outOfStock")}</Label>
                  <Switch
                     id="outOfStockOnly"
                     checked={outOfStockOnly}
                     onCheckedChange={(val) => {
                        setOutOfStockOnly(val)
                        if (val) setInStockOnly(false)
                     }}
                  />
               </div>
            </div>
         </Collapsible>
      </AsideBar>
   )
}





// /////////////////////////////////////////////////////////////// 
const ChooseBrand = ({ brands, selectedBrands, onChange }: ChooseBrandProps) => {

   const handleBrandToggle = (brand: string) => {
      onChange(brand)
   };
   return (
      <>
         {brands && brands.map((brand, i) => (
            <div key={brand} className="flex items-center gap-2">
               <Checkbox
                  id={`${brand}-${i}`}
                  title={brand}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
               />
               <Label htmlFor={`${brand}-${i}`}>{brand}</Label>
            </div>
         ))}
      </>
   )
}

// //////////////////////////////////////////////////////////////////



function ChooseCategory({
   locale,
   categories,
   value,
   defaultValue,
   onChange,
}: CategoryRadioProps) {
   if (!categories?.length) return null

   const getCategoryName = (category: Category) =>
      locale === "ar" ? category.nameAr : category.nameEn

   return (
      <RadioGroup value={value} onValueChange={onChange}>
         <div key={defaultValue} className="flex items-center gap-3">
            <RadioGroupItem value={"0"} id={defaultValue} />
            <Label htmlFor={defaultValue}>{defaultValue}</Label>
         </div>

         {categories.map((cat) => (
            <div key={cat.id.toString()} className="flex items-center gap-3 overflow-y-auto">
               <RadioGroupItem value={cat.id.toString()} id={cat.id.toString()} />
               <Label htmlFor={cat.id.toString()}>{getCategoryName(cat)}</Label>
            </div>
         ))}
      </RadioGroup>
   )
}


