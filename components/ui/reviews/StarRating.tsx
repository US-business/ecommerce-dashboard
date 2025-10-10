"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: "sm" | "md" | "lg"
    showNumber?: boolean
    interactive?: boolean
    onRatingChange?: (rating: number) => void
    className?: string
}

export function StarRating({
    rating,
    maxRating = 5,
    size = "md",
    showNumber = false,
    interactive = false,
    onRatingChange,
    className,
}: StarRatingProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    }

    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(value)
        }
    }

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {Array.from({ length: maxRating }, (_, index) => {
                const starValue = index + 1
                const isFilled = starValue <= Math.floor(rating)
                const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleClick(starValue)}
                        className={cn(
                            "relative transition-all",
                            interactive && "cursor-pointer hover:scale-110",
                            !interactive && "cursor-default"
                        )}
                    >
                        {/* Background star */}
                        <Star
                            className={cn(
                                sizeClasses[size],
                                "text-gray-300"
                            )}
                            fill="currentColor"
                        />

                        {/* Filled star (full or half) */}
                        {(isFilled || isHalfFilled) && (
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{
                                    width: isHalfFilled ? "50%" : "100%",
                                }}
                            >
                                <Star
                                    className={cn(
                                        sizeClasses[size],
                                        "text-yellow-400"
                                    )}
                                    fill="currentColor"
                                />
                            </div>
                        )}
                    </button>
                )
            })}

            {showNumber && (
                <span className="text-sm font-medium text-gray-700 ms-2">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    )
}
