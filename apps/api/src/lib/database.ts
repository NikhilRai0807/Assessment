import { prisma } from './prisma';

let schemaInitializationPromise: Promise<void> | null = null;

const schemaStatements = [
  `
    CREATE TABLE IF NOT EXISTS "Employee" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "fullName" TEXT NOT NULL,
      "jobTitle" TEXT NOT NULL,
      "department" TEXT NOT NULL,
      "country" TEXT NOT NULL,
      "salary" INTEGER NOT NULL,
      "currency" TEXT NOT NULL,
      "employmentType" TEXT NOT NULL,
      "hireDate" DATETIME NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )
  `,
  `CREATE INDEX IF NOT EXISTS "Employee_country_idx" ON "Employee"("country")`,
  `CREATE INDEX IF NOT EXISTS "Employee_jobTitle_idx" ON "Employee"("jobTitle")`,
  `CREATE INDEX IF NOT EXISTS "Employee_country_jobTitle_idx" ON "Employee"("country", "jobTitle")`,
];

export const ensureDatabaseSchema = async () => {
  if (!schemaInitializationPromise) {
    schemaInitializationPromise = (async () => {
      for (const statement of schemaStatements) {
        await prisma.$executeRawUnsafe(statement);
      }
    })();
  }

  await schemaInitializationPromise;
};
