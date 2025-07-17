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

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
