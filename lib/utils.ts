import bcrypt from "bcryptjs"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { randomBytes } from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
export function isValidUsername(username: string): boolean {
  const re = /^[a-zA-Z0-9_]{3,20}$/
  return re.test(username)
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  const re = /^\+?[1-9]\d{1,14}$/
  return re.test(phoneNumber)
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  // Use a secure hashing algorithm
  const hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

// Secure password comparison using bcrypt
export  async function comparePasswords(inputPassword: string, storedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, storedPassword) // inputPassword === storedPassword
}
/**
 * تولد مفتاح سري عشوائي بطول 64 بايت (128 حرف هكس)
 * تستخدمها مثلاً كـ JWT_SECRET أو لأي استخدام أمني آخر
 */
export function generateSecretKey(): string {
  return randomBytes(64).toString("hex")
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

