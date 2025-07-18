// lib/prisma.ts
import { PrismaClient } from '../generated/prisma';
import { withAccelerate } from "@prisma/extension-accelerate";


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



// Learn more about instantiating PrismaClient in Next.js here: https://www.prisma.io/docs/data-platform/accelerate/getting-started

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
