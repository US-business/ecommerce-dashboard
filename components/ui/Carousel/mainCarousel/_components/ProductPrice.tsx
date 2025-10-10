"use client"

interface ProductPriceProps {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    currency?: string;
    dir?: 'ltr' | 'rtl';
}

export function ProductPrice({ 
    originalPrice, 
    finalPrice, 
    hasDiscount,
    currency = 'EGP',
    dir = 'ltr' 
}: ProductPriceProps) {
    const currencyLabel = dir === 'rtl' ? 'ج.م' : currency;

    return (
        <div className="flex items-baseline gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {finalPrice.toFixed(2)}
                </span>
                <span className="text-lg font-semibold text-muted-foreground">
                    {currencyLabel}
                </span>
            </div>
            {hasDiscount && (
                <div className="flex items-center gap-2">
                    <span className="text-lg text-muted-foreground line-through decoration-2">
                        {originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                        {dir === 'rtl' ? 'وفر' : 'Save'} {(originalPrice - finalPrice).toFixed(2)} {currencyLabel}
                    </span>
                </div>
            )}
        </div>
    );
}