import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../shadcnUI/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    dir?: "ltr" | "rtl";
}

export function Collapsible({ title, children, defaultOpen = true, className, dir = "ltr" }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn("border-b border-gray-200  last:border-b-1 relative z-10 ", className)}>
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-10 w-full justify-between px-4 py-2 font-medium text-left ${dir === "rtl" ? "flex-row-reverse" : ""} ${isOpen? "bg-gray-100" : ""} hover:bg-gray-50`}
                dir={dir}
            >
                <span className="text-sm font-semibold text-gray-900">{title}</span>
                <ChevronDown className={` w-6 h-6  pointer-events-none  transition-transform duration-400 ${isOpen ? "rotate-180" : ""}`} />

            </Button>
                <div className={`relative transition-all duration-400 ${isOpen ? "max-h-[2000px] overflow-y-auto" : "max-h-0 overflow-hidden"}`}>


                    <div className="px-4 py-3 flex flex-col gap-4">
                        {children}
                    </div>
                </div>
            
        </div>
    );
}














// import { ChevronDown } from 'lucide-react'
// import React, { useState } from 'react'
// type AsideBarProps = {
//     dir?: "ltr" | "rtl"
//     children?: React.ReactNode
//     title?: string
// }
// const Collapsible = ({ dir, children, title }: AsideBarProps) => {
//     const [open, setOpen] = useState(true)

//     return (
//         <>
//             <div className="border-b py-5 px-4">
//                 {/* العنوان */}
//                 <div className="flex justify-between items-center relative select-none">
//                     <label htmlFor={title} className={"text-sm w-full h-full font-medium bg-[#f5f5f5] cursor-pointer py-2 px-3 rounded-md"}>
//                         {title}
//                     </label>
//                     <input
//                         type="checkbox"
//                         id={title}
//                         checked={open}
//                         onChange={() => setOpen(!open)}
//                         className="w-0 h-0 hidden"
//                     />
//                     <ChevronDown className={`${dir === "rtl" ? "left-0.5" : "right-0.5"} w-6 h-6 absolute top-1/2 pointer-events-none -translate-y-1/2 transition-transform duration-300 ${open ? "rotate-180" : ""}`}/>
//                 </div>
//                 <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60" : "max-h-0"}`}>
//                     <div className="pl-2 flex flex-col gap-2 mt-3">
//                         {children}
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Collapsible