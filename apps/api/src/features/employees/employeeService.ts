import type { Prisma } from '@prisma/client';

import { ensureDatabaseSchema } from '../../lib/database';
import { prisma } from '../../lib/prisma';
import type {
  CreateEmployeeInput,
  EmployeeListQuery,
  UpdateEmployeeInput,
} from './employeeSchemas';

const buildEmployeeWhere = (query: EmployeeListQuery): Prisma.EmployeeWhereInput => {
  const where: Prisma.EmployeeWhereInput = {};

  if (query.search) {
    where.fullName = {
      contains: query.search,
    };
  }

  if (query.country) {
    where.country = query.country;
  }

  if (query.jobTitle) {
    where.jobTitle = query.jobTitle;
  }

  return where;
};

export const employeeService = {
  async createEmployee(input: CreateEmployeeInput) {
    await ensureDatabaseSchema();
    return prisma.employee.create({
      data: input,
    });
  },

  async getEmployeeById(id: string) {
    await ensureDatabaseSchema();
    return prisma.employee.findUnique({
      where: { id },
    });
  },

  async updateEmployee(id: string, input: UpdateEmployeeInput) {
    await ensureDatabaseSchema();
    return prisma.employee.update({
      where: { id },
      data: input,
    });
  },

  async deleteEmployee(id: string) {
    await ensureDatabaseSchema();
    return prisma.employee.delete({
      where: { id },
    });
  },

  async listEmployees(query: EmployeeListQuery) {
    await ensureDatabaseSchema();
    const where = buildEmployeeWhere(query);
    const skip = (query.page - 1) * query.pageSize;

    const [items, totalItems] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      items,
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / query.pageSize),
    };
  },
};
