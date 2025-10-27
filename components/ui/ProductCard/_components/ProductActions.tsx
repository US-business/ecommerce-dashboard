import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { cn } from "@/lib/utils"
import WishlistButton from "@/components/ui/WishlistButton"

interface ProductActionsProps {
    isVisible: boolean
    isAddingToCart: boolean
    onAddToCart: () => void
    addToCartText: string
    addingText: string
    dir: string
    productId: number | string
    lang?: string
    className?: string
}

export const ProductActions = ({
    isVisible,
    isAddingToCart,
    onAddToCart,
    addToCartText,
    addingText,
    dir,
    productId,
    lang = 'en',
    className
}: ProductActionsProps) => {
    if (!isVisible) return null

    return (
        <div className={cn("flex items-center flex-wrap gap-2 mt-2", className)}>
            <Button
                onClick={onAddToCart}
                disabled={isAddingToCart}
                className={cn(
                    "flex-1 bg-amber-500/10 text-amber-950 hover:bg-amber-500/20 border border-amber-500/70 h-8 text-md rounded-lg font-normal",
                    "cursor-pointer hover:border-2 hover:border-color-frontground-700 transition duration-200 flex items-center justify-center gap-3 hover:text-amber-900 text-amber-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                <ShoppingCart className="h-4 w-4" />
                <span>
                    {isAddingToCart ? addingText : addToCartText}
                </span>
            </Button>
            <WishlistButton
                productId={productId}
                dir={dir}
                lang={lang}
                className="h-8 w-8"
            />
        </div>
    )
}
