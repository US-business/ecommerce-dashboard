import React from 'react'
type SwitchButtonProps = {
    title?: string
    checked: boolean
    setChecked: (checked: boolean) => void
    dir?: "ltr" | "rtl"
    className?: string
}
const SwitchButton = ({ title, checked, setChecked, dir, className }: SwitchButtonProps) => {

    return (
        <>
            <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
                {dir === "rtl" && <span className="text-sm font-medium">{title}</span>}
                <div className="relative">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={checked}
                        onChange={() => {
                            setChecked(!checked)
                        }}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform"></div>
                </div>
                {dir === "ltr" && <span className="text-sm font-medium">{title}</span>}
            </label>
        </>
    )
}

export default SwitchButton