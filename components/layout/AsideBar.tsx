import { ChevronDown } from 'lucide-react'
import React from 'react'
type AsideBarProps = {
    dir?: "ltr" | "rtl"
    children: React.ReactNode
    title?: string
}
const AsideBar = ({ dir, children, title }: AsideBarProps) => {

    return (
        <>
            <aside className="hidden md:block w-80 p-5 bg-white border-1 rounded-2xl border-gray-200 h-[calc(100vh-4rem)] sticky top-16">
                <h2 className={`${dir === "rtl" ? "text-right" : "text-left"} text-lg font-medium border-b-1 mb-2`}>
                    {title}
                </h2>
                {children}
            </aside>
        </>
    )
}

export default AsideBar