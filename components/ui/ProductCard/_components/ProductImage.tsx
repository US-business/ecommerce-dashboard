import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductImageProps {
  productId: number
  images?: string[]
  imageAlt?: string
  productName: string
  lang: string
  className?: string
}

export const ProductImage = ({
  productId,
  images,
  imageAlt,
  productName,
  lang,
  className
}: ProductImageProps) => {
  return (
    <Link
      href={`/${lang}/products/${productId}`}
      className={cn(
        "relative w-full h-1/2 aspect-square overflow-hidden rounded-lg bg-gray-50",
        className
      )}
    >
      <Image
        src={images?.[0] || "/placeholder.jpg"}
        alt={imageAlt || productName}
        fill
        className="object-contain transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </Link>
  )
}
