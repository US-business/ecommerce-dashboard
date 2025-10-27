import { z } from "zod";

export const profileFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export type User = {
  id: number;
  username: string | null;
  email: string;
  role: "super_admin" | "viewer";
  password?: string;
  address?: string | null;
  phoneNumber?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface ProfileFormProps {
  user: User;
  dictionary: any;
  onUpdate?: (updatedUser: any) => void;
}
