import { Checkbox } from '@/components/shadcnUI/checkbox'
import { Label } from '@/components/shadcnUI/label'
import React from 'react'

type ChooseBrandProps = {
    brands: string[]
    selectedBrands: string[]
    onChange: (brand: string) => void
}

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

export default ChooseBrand







// import React from 'react'

// type ChooseBrandProps = {
//     brands: string[]
//     selectedBrands: string[]
//     onChange : (brand: string) => void
// }

// const ChooseBrand = ({brands, selectedBrands , onChange}: ChooseBrandProps) => {

//     const handleBrandToggle = (brand: string) => {
//         onChange(brand)
//     };

//     return (
//         <>
//                             {brands && brands.map((brand , i) => (
//                                 <div key={brand} className="flex items-center gap-2">
//                                     <input
//                                     id={`${brand}-${i}`}
//                                     title={brand}
//                                         type="checkbox"
//                                         checked={selectedBrands.includes(brand)}
//                                         onChange={() => handleBrandToggle(brand)}
//                                     />
//                                     <label htmlFor={`${brand}-${i}`}>{brand}</label>
//                                 </div>
//                             ))}
//         </>
//     )
// }

// export default ChooseBrand