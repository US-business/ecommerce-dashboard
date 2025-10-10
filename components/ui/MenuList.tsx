"use client"

import { useState } from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const productsFilterStatus = [
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
]

export default function SortByFilter({ t }: { t: any }) {
    const [open, setOpen] = useState(false)
    const [sortBy, setSortBy] = useState("")

    return (
        <div className="relative w-full">
            {/* الزر */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white hover:bg-gray-50"
            >
                {sortBy
                    ? productsFilterStatus.find((filter) => filter.value === sortBy)?.label
                    : t("search.sortBy")}
                <ChevronsUpDown className="opacity-50 h-4 w-4" />
            </button>

            {/* القائمة */}
            {open && (
                <ul className="absolute left-0 right-0 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                    {productsFilterStatus.map((filter) => (
                        <li
                            key={filter.value}
                            onClick={() => {
                                setSortBy(filter.value === sortBy ? "" : filter.value)
                                setOpen(false)
                            }}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100",
                                sortBy === filter.value && "bg-gray-50"
                            )}
                        >
                            <span>{filter.label}</span>
                            <Check
                                className={cn(
                                    "ml-2 h-4 w-4 transition-opacity",
                                    sortBy === filter.value ? "opacity-100" : "opacity-0"
                                )}
                            />
                        </li>
                    ))}

                    {productsFilterStatus.length === 0 && (
                        <li className="px-3 py-2 text-gray-500 text-sm">Not found.</li>
                    )}
                </ul>
            )}
        </div>
    )
}
