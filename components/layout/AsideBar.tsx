import { ChevronDown } from 'lucide-react'
import React from 'react'
type AsideBarProps = {
    dir?: "ltr" | "rtl"
    children: React.ReactNode
    title?: string
    iconRight?: React.ReactNode
    iconLeft?: React.ReactNode
    className?: string
}
const AsideBar = ({ dir, children, title, iconRight , iconLeft , className }: AsideBarProps) => {


    return (
        <>
            <aside className={`relative z-10  flex-col gap-1.5 min-w-80 p-5 bg-white border-1 rounded-2xl border-gray-200 ${className}`}>
                <h2 className={`${dir === "rtl" ? "text-right" : "text-left"} flex items-center gap-2 text-lg font-medium border-b-1 py-1 mb-2 relative z-10`}>
                    {iconLeft && <div>{iconLeft}</div>}
                    {title}
                    {iconRight && <div>{iconRight}</div>}
                </h2>
                <div className={"flex flex-col gap-1.5"}>
                    {children}
                </div>
            </aside>
        </>
    )
}

export default AsideBar