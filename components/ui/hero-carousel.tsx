'use client';

import React from 'react';

interface HeroCarouselProps {
    title?: string;
    subtitle?: string;
    images?: string[];
    className?: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
    title = "Quality for Every Home",
    subtitle = "Explore our curated collection of clothing, kitchen tools, home décor, electrical appliances, and more. Find everything you need to elevate your lifestyle.",
    images = [
        "https://res.cloudinary.com/dvpp7fsht/image/upload/v1761217024/Adobe_Exprevvss_-_file_linqul.png",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD7PxKeqs0ri3v4xWiegIlIPvJIHGQ4UMTkWosZQQQTrQNZ9pj96fbyANFay1Gj0tlfDzA4WzOxbhq6RtgV6iAw4o_ncoHjfqZUwEFT879jPMBbLl11OFuQXUxbgeDn9mjuIpofhA68ko3BwWyQqIpdCKchJl24hED-n32EHG5EBocfrKbka1scFaTCVGUrVtWClw0FtOFwKQUHPTVSvGDA1F3en44cu9SaKTOMJS8MMMSPnQ1kL8ucUKIhnqaCNwxp4Zk5ImIxIqIg",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD7PxKeqs0ri3v4xWiegIlIPvJIHGQ4UMTkWosZQQQTrQNZ9pj96fbyANFay1Gj0tlfDzA4WzOxbhq6RtgV6iAw4o_ncoHjfqZUwEFT879jPMBbLl11OFuQXUxbgeDn9mjuIpofhA68ko3BwWyQqIpdCKchJl24hED-n32EHG5EBocfrKbka1scFaTCVGUrVtWClw0FtOFwKQUHPTVSvGDA1F3en44cu9SaKTOMJS8MMMSPnQ1kL8ucUKIhnqaCNwxp4Zk5ImIxIqIg"
    ],
    className = ""
}) => {
    return (
        <div className={`absolute top-0 left-0 h-dvh w-full overflow-hidden ${className}`}>
            {/* Animated Background Carousel */}
            <div className="absolute inset-0 w-full h-full flex animate-slide z-0">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex-shrink-0 bg-cover bg-center"
                        style={{
                            // backgroundImage: `url("${image}")` 
                            backgroundImage: `linear-gradient(rgba(0, 31, 63, 0.2) 0%, rgba(0, 31, 63, 0.3) 100%), url("${image}")`
                        }}
                    />
                ))}
            </div>
            <div className="absolute inset-0 w-full h-full flex bg-[linear-gradient(180deg,transparent,transparent_5%,transparent_25%,white,#f1f5f8)]  z-0"></div>

            {/* <style jsx>{`
        @keyframes slide {
          0%, 100% {
            transform: translateX(0%);
          }
          25% {
            transform: translateX(0%);
          }
          33% {
            transform: translateX(-100%);
          }
          58% {
            transform: translateX(-100%);
          }
          66% {
            transform: translateX(-200%);
          }
          91% {
            transform: translateX(-200%);
          }
        }

        .animate-slide {
          animation: slide 15s infinite ease-in-out;
        }
      `}</style> */}
        </div>
    );
};

export default HeroCarousel;
