import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';





const Slider = ({ items, autoPlayInterval = 5000, className = '', dir = 'ltr' }: { items: any[]; autoPlayInterval?: number; className?: string; dir?: string }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);



    // Auto-play functionality
    const startAutoPlay = () => {
        stopAutoPlay(); // Clear any existing interval first
        autoPlayRef.current = setInterval(() => {
            setCurrentIndex((prev) => {
                setIsTransitioning(true); // Enable smooth transition for autoplay
                const nextIndex = (prev + 1) % items.length;
                return nextIndex;
            });
        }, autoPlayInterval);
    };

    const stopAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
    };

    // Navigation functions
    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const handleDotClick = (index: number) => {
        if (isTransitioning || index === currentIndex) return;
        stopAutoPlay();
        setIsTransitioning(true);
        setCurrentIndex(index);
        // Restart autoplay after a short delay
        setTimeout(() => {
            startAutoPlay();
        }, 500);
    };

    // Handle transition end
    const handleTransitionEnd = () => {
        setIsTransitioning(false);
    };

    // Get transform value for each slide
    const getSlideTransform = (index: number) => {
        if (index === currentIndex) {
            return 'translateX(0%)';
        }

        // Calculate next and previous indices
        const nextIndex = (currentIndex + 1) % items.length;
        const prevIndex = (currentIndex - 1 + items.length) % items.length;

        if (index === nextIndex) {
            return 'translateX(100%)';
        } else if (index === prevIndex) {
            return 'translateX(-100%)';
        } else {
            return 'translateX(200%)'; // Hide completely off-screen
        }
    };

    // Effects
    useEffect(() => {
        if (items.length > 1) {
            startAutoPlay();
        }
        return () => stopAutoPlay();
    }, [autoPlayInterval, items.length]);

    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 700); // Match the CSS transition duration
            return () => clearTimeout(timer);
        }
    }, [currentIndex, isTransitioning]);

    return (
        // <div className={`relative w-full max-w-4xl h-60 md:h-80 bg-gradient-to-br from-cyan-200/80 to-blue-500/80 border-6 border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
        <div className={`relative w-full flex flex-col h-full bg-white overflow-hidden rounded-md ${className}`}>
            <div className="relative w-full h-full "
            >
                {/* <div className="absolute inset-0 z-10 bg-linear-to-r from-emerald-50 via-transparent to-emerald-50" /> */}
                <div className="absolute inset-0 z-10 bg-linear-to-r from-white via-transparent to-white" />
                {items.map((product, index) => (
                    <article
                        key={product.id || index}
                        className={`absolute flex md:flex-row flex-col  w-full h-full px-8 py-8 md:px-6 md:text-center text-gray-800 transition-all duration-700 ease-in-out ${index === currentIndex ? "opacity-100 visible z-10" : "opacity-0 invisible z-0"
                            }`}
                        style={{
                            transform: getSlideTransform(index),
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {/* <div title='background-image' className='absolute left-10 top-0 z-0 w-1/2 h-full'> */}
                        <div title='background-image' className='relative z-0 w-1/2 h-full '>
                            <Image src={product.image} fill sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' alt={product.nameEn}
                                className="object-contain" />
                        </div>
                        {/* النصوص والمحتوى */}
                        <div className="relative z-10 text-gray-700 flex flex-col gap-3 p-20 w-1/2">
                            <h3 className="text-sm font-semibold uppercase tracking-wider ">
                                {product.brand}
                            </h3>
                            <h1 className="text-3xl md:text-2xl font-bold uppercase  leading-tight">
                                {dir === "ltr" ? product.nameEn : product.nameAr}
                            </h1>
                            <p className="text-sm leading-relaxed text-center overflow-hidden line-clamp-3 text-gray-600">{dir === "ltr" ? product.descriptionEn : product.descriptionAr}</p>
                            <a
                                href="#"
                                className="inline-block text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-300"
                            >
                                Learn More →
                            </a>
                        </div>
                    </article>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className="absolute top-1/2 left-6 md:left-4 w-12 h-12 md:w-10 md:h-10 -translate-y-1/2 cursor-pointer z-50 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 hover:scale-110 hover:shadow-lg active:scale-95 group"
                onClick={() => {
                    stopAutoPlay();
                    handlePrev();
                    setTimeout(startAutoPlay, 500);
                }}
                aria-label="Previous slide"
            >
                <div className="absolute top-1/2 left-1/2 w-4 h-4 md:w-3 md:h-3 border-t-2 border-l-2 border-gray-700 -rotate-45 -translate-x-1/2 -translate-y-1/2 group-hover:border-gray-800 transition-colors duration-300"></div>
            </button>

            <button
                className="absolute top-1/2 right-6 md:right-4 w-12 h-12 md:w-10 md:h-10 -translate-y-1/2 cursor-pointer z-50 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 hover:scale-110 hover:shadow-lg active:scale-95 group"
                onClick={() => {
                    stopAutoPlay();
                    handleNext();
                    setTimeout(startAutoPlay, 500);
                }}
                aria-label="Next slide"
            >
                <div className="absolute top-1/2 left-1/2 w-4 h-4 md:w-3 md:h-3 border-t-2 border-r-2 border-gray-700 rotate-45 -translate-x-1/2 -translate-y-1/2 group-hover:border-gray-800 transition-colors duration-300"></div>
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3 z-50 bg-black/20 backdrop-blur-sm rounded-full px-4 py-1">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={`border-none rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${index === currentIndex
                            ? 'w-6 h-3 rounded-full bg-white shadow-lg'
                            : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                            }`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* No custom styles needed now */}
        </div>
    );
};

export default Slider;



