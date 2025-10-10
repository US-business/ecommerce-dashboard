export type User = {
    id: number;
    username: string | null;
    email: string;
    role: "super_admin" | "viewer";
    password?: string;
    address?: string | null;
    phoneNumber?: string | null;
    image?: string | null;
    googleId?: string | null;
    provider?: string | null;
    emailVerified?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}
