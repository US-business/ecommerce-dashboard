"use client"
import Image from 'next/image';
import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi
} from "@/components/shadcnUI/carousel";

interface CarouselComponentProps {
    items: Array<{
        id: string | number;
        images: string[];
        brand: string;
        nameEn: string;
        nameAr: string;
        descriptionEn: string;
        descriptionAr: string;
    }> | undefined;
    autoPlayInterval?: number;
    className?: string;
    dir?: 'ltr' | 'rtl';
}

const CarouselMain = ({
    items,
    autoPlayInterval = 5000,
    className = '',
    dir = 'ltr'
}: CarouselComponentProps) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    // Auto-play functionality
    React.useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [api, autoPlayInterval]);

    // Track current slide
    React.useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className={`w-full h-full rounded-md overflow-hidden bg-amber-950  ${className}`}>
        {/* <div className={`relative w-full max-w-4xl h-60 md:h-80 bg-gradient-to-br from-cyan-200/80 to-blue-500/80 border-6 border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl ${className}`}> */}

            <Carousel
                setApi={setApi}
                className="w-full h-full bg-white"
                opts={{
                    align: "start",
                    loop: true,
                    dragFree: true,
                    direction: dir === "rtl" ? "rtl" : "ltr",
                }}
            >
                <CarouselContent>
                    {items?.map((product, index) => (
                        <CarouselItem key={product.id || index}>
                            <article className="relative flex md:flex-row flex-col w-full h-60 md:h-80 px-8 py-8 md:px-6  overflow-hidden rounded-md">
                                {/* Product Image */}
                                <div className="relative z-0 w-full md:w-1/2 h-1/2 md:h-full">
                                    <Image
                                        src={product.images?.[0] || "/placeholder.jpg"}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        alt={product.nameEn}
                                        className="object-contain"
                                    />
                                </div>

                                {/* Product Content */}
                                <div className="relative z-10 text-gray-700 flex flex-col justify-center gap-3 p-4 md:p-20 w-full md:w-1/2">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider">
                                        {product.brand}
                                    </h3>
                                    <h1 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                                        {dir === "ltr" ? product.nameEn : product.nameAr}
                                    </h1>
                                    <p className="text-sm leading-relaxed text-center overflow-hidden line-clamp-3 text-gray-600">
                                        {dir === "ltr" ? product.descriptionEn : product.descriptionAr}
                                    </p>
                                    <a
                                        href="#"
                                        className="inline-block text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-300"
                                    >
                                        Learn More →
                                    </a>
                                </div>
                            </article>
                        </CarouselItem>
                    ))}
                    {/* Background gradient overlay */}
                </CarouselContent>
                {/* <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-transparent to-white pointer-events-none" /> */}
                <div className="absolute top-0 left-0 pointer-events-none bg-linear-[90deg,#ffff,transparent_20%,transparent_75%,#ffff] w-full h-full" />

                {/* Custom styled navigation buttons */}
                <CarouselPrevious className="absolute top-1/2 left-6 md:left-4 w-12 h-12 md:w-10 md:h-10 -translate-y-1/2 z-50 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 hover:scale-110 hover:shadow-lg active:scale-95" />
                <CarouselNext className="absolute top-1/2 right-6 md:right-4 w-12 h-12 md:w-10 md:h-10 -translate-y-1/2 z-50 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 hover:scale-110 hover:shadow-lg active:scale-95" />

                {/* Custom dots navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3 z-50 bg-black/20 backdrop-blur-sm rounded-full px-5 py-1">
                    {items?.map((_, index) => (
                        <button
                            key={index}
                            className={`border-none rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${index === current
                                ? 'w-8 h-2 rounded-full bg-white shadow-lg'
                                : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                                }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </Carousel>
        </div>
    );
};

export default CarouselMain;

















