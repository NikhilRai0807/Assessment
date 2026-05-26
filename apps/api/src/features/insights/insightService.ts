import { ensureDatabaseSchema } from '../../lib/database';
import { prisma } from '../../lib/prisma';
import type { CountryQuery, JobTitleAverageQuery, SalaryDistributionQuery } from './insightSchemas';

type DistributionRow = {
  bucketStart: number;
  bucketEnd: number;
  employeeCount: number;
};

const calculateMedian = (salaries: number[]) => {
  if (salaries.length === 0) {
    return 0;
  }

  const midpoint = Math.floor(salaries.length / 2);

  if (salaries.length % 2 === 0) {
    return (salaries[midpoint - 1] + salaries[midpoint]) / 2;
  }

  return salaries[midpoint];
};

const toFiniteNumber = (value: unknown) =>
  typeof value === 'number' ? value : Number(value ?? 0);

export const insightService = {
  async getSalaryByCountry({ country }: CountryQuery) {
    await ensureDatabaseSchema();

    const aggregate = await prisma.employee.aggregate({
      where: { country },
      _count: { _all: true },
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
      _sum: { salary: true },
    });

    const salaryRows = await prisma.employee.findMany({
      where: { country },
      select: { salary: true },
      orderBy: { salary: 'asc' },
    });

    const salaries = salaryRows.map((row) => row.salary);

    return {
      country,
      employeeCount: aggregate._count._all,
      minSalary: aggregate._min.salary ?? 0,
      maxSalary: aggregate._max.salary ?? 0,
      averageSalary: aggregate._avg.salary ?? 0,
      medianSalary: calculateMedian(salaries),
      totalPayroll: aggregate._sum.salary ?? 0,
    };
  },

  async getJobTitleAverage({ country, jobTitle }: JobTitleAverageQuery) {
    await ensureDatabaseSchema();

    const aggregate = await prisma.employee.aggregate({
      where: { country, jobTitle },
      _avg: { salary: true },
    });

    return {
      country,
      jobTitle,
      averageSalary: aggregate._avg.salary ?? 0,
    };
  },

  async getSummary() {
    await ensureDatabaseSchema();

    const aggregate = await prisma.employee.aggregate({
      _count: { _all: true },
      _sum: { salary: true },
      _avg: { salary: true },
      _min: { salary: true },
      _max: { salary: true },
    });

    return {
      employeeCount: aggregate._count._all,
      totalPayroll: aggregate._sum.salary ?? 0,
      averageSalary: aggregate._avg.salary ?? 0,
      minSalary: aggregate._min.salary ?? 0,
      maxSalary: aggregate._max.salary ?? 0,
    };
  },

  async getTopPayingJobTitles(limit = 5) {
    await ensureDatabaseSchema();

    const rows = (await prisma.$queryRawUnsafe(`
      SELECT
        "jobTitle" as jobTitle,
        ROUND(AVG("salary"), 2) as averageSalary,
        COUNT(*) as employeeCount
      FROM "Employee"
      GROUP BY "jobTitle"
      ORDER BY AVG("salary") DESC
      LIMIT ${Number(limit)}
    `)) as Array<{ jobTitle: string; averageSalary: number; employeeCount: number }>;

    return rows.map((row) => ({
      jobTitle: row.jobTitle,
      averageSalary: toFiniteNumber(row.averageSalary),
      employeeCount: toFiniteNumber(row.employeeCount),
    }));
  },

  async getSalaryDistribution({ country, bucketSize }: SalaryDistributionQuery) {
    await ensureDatabaseSchema();

    const countryClause = country ? `WHERE "country" = '${country.replace(/'/g, "''")}'` : '';
    const rows = (await prisma.$queryRawUnsafe(`
      SELECT
        CAST(("salary" / ${bucketSize}) AS INTEGER) * ${bucketSize} as bucketStart,
        CAST(("salary" / ${bucketSize}) AS INTEGER) * ${bucketSize} + ${bucketSize} - 1 as bucketEnd,
        COUNT(*) as employeeCount
      FROM "Employee"
      ${countryClause}
      GROUP BY CAST(("salary" / ${bucketSize}) AS INTEGER)
      ORDER BY bucketStart ASC
    `)) as DistributionRow[];

    return rows.map((row) => ({
      bucketStart: toFiniteNumber(row.bucketStart),
      bucketEnd: toFiniteNumber(row.bucketEnd),
      employeeCount: toFiniteNumber(row.employeeCount),
    }));
  },
};
