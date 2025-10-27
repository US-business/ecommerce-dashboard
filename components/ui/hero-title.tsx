'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface HeroTitleProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({
    title = "Quality for Every Home",
    subtitle = "Explore our curated collection of clothing, kitchen tools, home décor, electrical appliances, and more. Find everything you need to elevate your lifestyle.",
    className = ""
}) => {
    return (
            <div className={cn("relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-12 overflow-hidden w-full",` ${className}`)}>
                <div className="flex flex-col gap-6 text-center ">
                    {/* Main Title */}
                    {/* <h1 className="text-white drop-shadow-2xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight animate-in fade-in duration-700"> */}
                    <h1 className={cn("drop-shadow-2xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                        "rounded-lg",
                        "font-black bg-gradient-to-r from-blue-800 to-amber-800 bg-clip-text text-transparent",
                        "bg-background/80 backdrop-blur-md",
                        "leading-tight tracking-tight animate-in fade-in duration-700")}>
                        {title}
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-white/95 drop-shadow-lg text-base sm:text-lg md:text-xl font-medium leading-relaxed mx-auto animate-in fade-in duration-700 delay-150">
                        {subtitle}
                    </p>
                </div>
            </div>
    );
};

export default HeroTitle;
