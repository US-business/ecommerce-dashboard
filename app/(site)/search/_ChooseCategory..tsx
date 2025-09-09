"use client"

import { RadioGroup, RadioGroupItem } from "@/components/shadcnUI/radio-group"
import { Label } from "@/components/shadcnUI/label"

interface Category {
    id: number
    nameAr: string
    nameEn: string
}

interface CategoryRadioProps {
    categories: Category[]
    value: string
    onChange: (value: string) => void
    locale: string
    defaultValue: string

}

export default function ChooseCategory({
    locale,
    categories,
    value,
    defaultValue,
    onChange,
}: CategoryRadioProps) {
    if (!categories.length) return null

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






























// "use client"

// import { useState } from "react"
// import { ChevronDown } from "lucide-react"

// interface Category {
//     id: number
//     nameAr: string
//     nameEn: string
// }


// interface CategoryRadioProps {
//     categories: Category[]
//     onChange: (value: string | any) => void,

//     locale: string
//     catogry: string
// }

// export default function ChooseCategory({
//     categories,
//     onChange,
//     locale,
//     catogry
// }: CategoryRadioProps) {
//     const [open, setOpen] = useState(true)
//     const getCategoryName = (category: Category) => locale === "ar" ? category.nameAr : category.nameEn
//     const idToString = (val : number) => val.toString()

//     return (
//         <div className="border-b pb-2">
//             {/* العنوان */}
//             <button
//                 onClick={() => setOpen(!open)}
//                 className="flex justify-between w-full items-center font-medium py-2"
//             >
//                 الفئات
//                 <ChevronDown
//                     className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""
//                         }`}
//                 />
//             </button>

//             {/* المحتوى */}
//             <div
//                 className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60" : "max-h-0"
//                     }`}
//             >
//                 <div className="pl-2 flex flex-col gap-2 mt-2">
//                     {categories.map((cat) => (
//                         <label
//                             key={getCategoryName(cat)}
//                             className="flex items-center gap-2 cursor-pointer"
//                         >
//                             <input
//                                 type="radio"
//                                 name="category"
//                                 value={idToString(cat.id)}
//                                 checked={catogry === idToString(cat.id)}

//                                 onChange={(e) => onChange(e.target.value)}
//                                 className="accent-blue-600 w-4 h-4"
//                             />
//                             <span>{getCategoryName(cat)}</span>
//                         </label>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }















