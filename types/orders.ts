export type Product = {
    id: number;
    brand: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    nameEn: string;
    nameAr: string;
    slug: string;
    sku: string;
    images: string[]; // Added images field
};

export type OrderItem = {
    id: number;
    price: string;
    productId: number;
    quantity: number;
    orderId: number;
    product: Product;
};

export type Order = {
    id: number;
    userId: number;
    user?: { username?: string; email?: string } | null;
    totalAmount: number | string;
    status: string;
    taxRate: number | string | null;
    taxAmount: number | string | null;
    shippingAddress: string;
    shippingMethod: string;
    paymentType: string;
    paymentStatus: string;
    trackingNumber?: string;
    createdAt: Date | string | null;
    updatedAt: Date | string | null;
    items?: OrderItem[]; // Updated to use OrderItem type
};
