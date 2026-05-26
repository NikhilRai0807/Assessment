import { z } from 'zod';

const employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN'] as const;
const sortableFields = ['fullName', 'country', 'jobTitle', 'salary', 'hireDate', 'createdAt'] as const;

const trimmedRequiredString = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`);

const currencySchema = z
  .string()
  .trim()
  .length(3, 'currency must be a 3-letter code')
  .transform((value) => value.toUpperCase());

const hireDateSchema = z
  .string()
  .datetime({ offset: true })
  .or(
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'hireDate must be a valid ISO date')
      .transform((value) => `${value}T00:00:00.000Z`),
  )
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), {
    message: 'hireDate must be a valid date',
  });

export const employeeCreateSchema = z.object({
  fullName: trimmedRequiredString('fullName'),
  jobTitle: trimmedRequiredString('jobTitle'),
  department: trimmedRequiredString('department'),
  country: trimmedRequiredString('country'),
  salary: z.number().int().positive('salary must be greater than 0'),
  currency: currencySchema,
  employmentType: z.enum(employmentTypes),
  hireDate: hireDateSchema,
});

export const employeeUpdateSchema = employeeCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
  });

export const employeeListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  country: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  sortBy: z.enum(sortableFields).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type CreateEmployeeInput = z.infer<typeof employeeCreateSchema>;
export type UpdateEmployeeInput = z.infer<typeof employeeUpdateSchema>;
export type EmployeeListQuery = z.infer<typeof employeeListQuerySchema>;
