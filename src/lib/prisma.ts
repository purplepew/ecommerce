// lib/prisma.ts
import { PrismaClient } from '../generated/prisma';

export type User = {
  id: number;
  username: string | null;
  password: string | null;
  email: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  name: string | null;
  pfp: string  | null;
};

declare global {
  // Prevent multiple PrismaClient instances in development
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
