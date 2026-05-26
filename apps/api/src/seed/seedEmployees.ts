import fs from 'node:fs/promises';
import path from 'node:path';

import { ensureDatabaseSchema } from '../lib/database';
import { prisma } from '../lib/prisma';
import { generateEmployeeSeedData } from './generateEmployeeSeedData';

const readLines = async (filePath: string) => {
  const content = await fs.readFile(filePath, 'utf8');

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
};

const chunk = <T>(items: T[], chunkSize: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
};

const main = async () => {
  await ensureDatabaseSchema();

  const firstNamesPath = path.join(__dirname, '../../prisma/data/first_names.txt');
  const lastNamesPath = path.join(__dirname, '../../prisma/data/last_names.txt');
  const firstNames = await readLines(firstNamesPath);
  const lastNames = await readLines(lastNamesPath);
  const batchSize = 500;
  const { employees, totalCount, batchCount } = generateEmployeeSeedData(
    firstNames,
    lastNames,
    10000,
    batchSize,
  );

  await prisma.$transaction(async (transaction) => {
    await transaction.employee.deleteMany();

    for (const batch of chunk(employees, batchSize)) {
      await transaction.employee.createMany({
        data: batch.map((employee) => ({
          ...employee,
          hireDate: new Date(`${employee.hireDate}T00:00:00.000Z`),
        })),
      });
    }
  });

  console.log(`Seeded ${totalCount} employees in ${batchCount} batches.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
