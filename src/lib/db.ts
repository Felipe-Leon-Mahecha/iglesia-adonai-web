import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  return new PrismaClient();
}

export const db: PrismaClient | null = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db ?? undefined;
}

export function dbDisponible(): boolean {
  return Boolean(db);
}