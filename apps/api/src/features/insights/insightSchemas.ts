import { z } from 'zod';

const requiredString = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`);

export const countryQuerySchema = z.object({
  country: requiredString('country'),
});

export const jobTitleAverageQuerySchema = z.object({
  country: requiredString('country'),
  jobTitle: requiredString('jobTitle'),
});

export const salaryDistributionQuerySchema = z.object({
  country: z.string().trim().optional(),
  bucketSize: z.coerce.number().int().positive().default(25000),
});

export type CountryQuery = z.infer<typeof countryQuerySchema>;
export type JobTitleAverageQuery = z.infer<typeof jobTitleAverageQuerySchema>;
export type SalaryDistributionQuery = z.infer<typeof salaryDistributionQuerySchema>;
