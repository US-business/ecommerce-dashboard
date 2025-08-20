import { useState } from "react";
import { ChevronDown, ChevronRight, Star, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useI18nStore } from "@/lib/stores";
import ChooseCategory from "../search/_ChooseCategory.";

interface FilterSidebarProps {
  filters: Filters;
  category: string
  onFiltersChange: (filters: Filters) => void;
  onClearAll: () => void;
  isMobile?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function CollapsibleSection({ title, children, defaultOpen = true, className }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-gray-100 last:border-b-0", className)}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between p-4 h-auto font-medium text-left hover:bg-gray-50"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </Button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((stars) => (
        <Button
          key={stars}
          variant="ghost"
          onClick={() => onRatingChange(stars)}
          className={cn(
            "w-full justify-start p-2 h-auto hover:bg-gray-50",
            rating === stars && "bg-blue-50 text-blue-700"
          )}
        >
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < stars
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">& up</span>
          </div>
        </Button>
      ))}
      {rating > 0 && (
        <Button
          variant="ghost"
          onClick={() => onRatingChange(0)}
          className="w-full justify-start p-2 h-auto text-sm text-gray-500 hover:bg-gray-50"
        >
          Clear rating filter
        </Button>
      )}
    </div>
  );
}

const categories = ["Electronics", "Clothing", "Footwear", "Accessories", "Home & Kitchen", "Sports", "Books"];
const brands = ["AudioTech", "SportMax", "EcoWear", "TechGear", "LuxeCase", "HomeStyle", "ProFit"];
const tags = ["New", "Featured", "Best Seller", "Limited Edition"];

export function FilterSidebar({ category, filters, onFiltersChange, onClearAll, isMobile = false }: FilterSidebarProps) {

  const [open, setOpen] = useState(true)



  const { t, locale } = useI18nStore()
  // const getProductName = (product: Product) => locale === "ar" ? product.nameAr : product.nameEn
  const getCategoryName = (category: any) => locale === "ar" ? category.nameAr : category.nameEn
  const updateCategorySearch = (update: string) => onFiltersChange(`${update}`)


  const updateFilters = (updates: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    updateFilters({ categories: newCategories });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);
    updateFilters({ brands: newBrands });
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter((t) => t !== tag);
    updateFilters({ tags: newTags });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto">
        {/* Sort By */}
        <CollapsibleSection title="Sort By">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </CollapsibleSection>

        {/* Categories */}
        {/* <CollapsibleSection title="Category"> */}

        <ChooseCategory
          categories={categories}
          selected={category}
          onChange={(category) => updateCategorySearch(category)}
        />




        {/* </CollapsibleSection> */}

        {/* Brands */}
        <CollapsibleSection title="Brand">
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-normal text-gray-700 cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Price Range */}
        <CollapsibleSection title="Price Range">
          <div className="space-y-4">
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* Rating */}
        <CollapsibleSection title="Customer Rating">
          <StarRating
            rating={filters.minRating}
            onRatingChange={(rating) => updateFilters({ minRating: rating })}
          />
        </CollapsibleSection>

        {/* Availability */}
        <CollapsibleSection title="Availability">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="in-stock" className="text-sm font-normal text-gray-700">
                In Stock Only
              </Label>
              <Switch
                id="in-stock"
                checked={filters.inStockOnly}
                onCheckedChange={(checked) => updateFilters({ inStockOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="on-sale" className="text-sm font-normal text-gray-700">
                On Sale Only
              </Label>
              <Switch
                id="on-sale"
                checked={filters.onSaleOnly}
                onCheckedChange={(checked) => updateFilters({ onSaleOnly: checked })}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Tags */}
        <CollapsibleSection title="Tags">
          <div className="space-y-3">
            {tags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={filters.tags.includes(tag)}
                  onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                />
                <Label
                  htmlFor={`tag-${tag}`}
                  className="text-sm font-normal text-gray-700 cursor-pointer"
                >
                  {tag}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
