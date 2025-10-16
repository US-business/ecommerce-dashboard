import React, { useState } from 'react';

// المكونات الأساسية للـ Pagination
const Pagination = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <nav role="navigation" aria-label="pagination" className={`mx-auto flex w-full justify-center ${className}`}>
        {children}
    </nav>
);

const PaginationContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <ul className={`flex flex-row items-center gap-1 ${className}`}>
        {children}
    </ul>
);

const PaginationItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <li className={className}>
        {children}
    </li>
);

const PaginationLink = ({ children, href, isActive, onClick, className = "" }: { children: React.ReactNode; href: string; isActive: boolean; onClick: (e: React.MouseEvent) => void; className?: string }) => (
    <a
        href={href}
        onClick={onClick}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors
    cursor-pointer hover:bg-gray-100 hover:border-gray-400
    h-9 w-9 ${isActive ? 'text-gray-600 border border-gray-300 hover:border-gray-700' : 'bg-white text-gray-700'
            } ${className}`}
        aria-current={isActive ? 'page' : undefined}
    >
        {children}
    </a>
);

const PaginationPrevious = ({ href, onClick, className = "", disabled, previousLabel , dir }: { href: string; onClick: (e: React.MouseEvent) => void; className?: string; disabled?: boolean, previousLabel?: string , dir?: string}) => (
    <a
        href={href}
        onClick={onClick}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors
        bg-white text-gray-700 h-9 px-3 ${disabled
                ? 'pointer-events-none opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:bg-gray-50 hover:border-gray-400'
            } ${className}`}
    >
        {dir === "rtl" ? (
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        ) : (
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        )}
        {previousLabel}
    </a>
);

const PaginationNext = ({ href, onClick, className = "", disabled, nextLabel , dir }: { href: string; onClick: (e: React.MouseEvent) => void; className?: string; disabled?: boolean, nextLabel?: string , dir?: string}) => (
    <a
        href={href}
        onClick={onClick}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors
        bg-white text-gray-700 h-9 px-3 ${disabled
                ? 'pointer-events-none opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:bg-gray-50 hover:border-gray-400'
            } ${className}`}
    >
        {nextLabel}
        {dir === "rtl" ? (
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        ) : (
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        )}
    </a>
);

const PaginationEllipsis = ({ className = "" }: { className?: string }) => (
    <span className={`flex h-9 w-9 items-center justify-center text-gray-500 ${className}`}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
        <span className="sr-only">المزيد من الصفحات</span>
    </span>
);

// المكون الرئيسي القابل لإعادة الاستخدام
const ReusablePagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
    showScrollToTop = true,
    nextLabel = "",
    previousLabel = "",
    dir
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    showScrollToTop?: boolean;
    nextLabel?: string;
    previousLabel?: string;
    dir?: string
}) => {
    const handlePageChange = (newPage: number) => {
        if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;

        onPageChange(newPage);

        if (showScrollToTop) {
            window.scroll({ top: 0, behavior: "smooth" });
        }
    };

    const generatePageNumbers = () => {
        const items = [];
        const first = 1;
        const last = totalPages;
        const start = Math.max(first, currentPage - 2);
        const end = Math.min(last, currentPage + 2);

        // إظهار الصفحة الأولى دائماً
        items.push(first);
        if (start > first + 1) items.push("ellipsis");

        // إظهار الصفحات حول الصفحة الحالية
        for (let p = start; p <= end; p++) {
            if (p !== first && p !== last) items.push(p);
        }

        // إظهار الصفحة الأخيرة
        if (end < last - 1) items.push("ellipsis");
        if (last > first) items.push(last);

        return items;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`flex justify-center mt-8 ${className}`}> 
            <Pagination>
                <PaginationContent className="gap-2">
                    {/* زر السابق */}
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            disabled={currentPage === 1}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage - 1);
                            }}
                            previousLabel={previousLabel}
                            dir={dir}
                            />
                    </PaginationItem>

                    {/* أرقام الصفحات */}
                    {generatePageNumbers().map((item, idx) => (
                        item === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={item}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === item}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(Number(item));
                                    }}
                                >
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ))}

                    {/* زر التالي */}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            disabled={currentPage >= totalPages}
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage + 1);
                            }}
                            nextLabel={nextLabel}
                            dir={dir}
                            />
                    </PaginationItem>
                </PaginationContent>
            </Pagination> 
        </div>
    );
};

export default ReusablePagination;

