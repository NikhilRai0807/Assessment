import os from 'node:os';
import path from 'node:path';

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

if (!process.env.DATABASE_URL) {
  const databasePath = path.join(os.tmpdir(), 'salary-management-api-dev.db');
  process.env.DATABASE_URL = `file:${databasePath.replace(/\\/g, '/')}`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
