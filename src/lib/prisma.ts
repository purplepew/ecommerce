// lib/prisma.ts
import { PrismaClient } from '../generated/prisma';

export type User = {
  id: number;
  email: string;
  username?: string | null;
  password?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  name?: string | null;
  pfp?: string  | null;
};

export type Product = {
    id: number;
    name: string;
    price: number;
    description?: string;
    ratingsCount?: number;
    ratingsAverage?: number;
    freeShipping?: boolean;
    image?: string
}

export type Review = {
  id: number;
  productId: number;
  userId: number;
  rating: number;
}

declare global {
  // Prevent multiple PrismaClient instances in development
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
