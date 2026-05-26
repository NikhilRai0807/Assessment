import { Router } from 'express';
import { ZodError } from 'zod';

import {
  countryQuerySchema,
  jobTitleAverageQuerySchema,
  salaryDistributionQuerySchema,
} from './insightSchemas';
import { insightService } from './insightService';

const formatValidationErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

export const insightRouter = Router();

insightRouter.get('/salary-by-country', async (request, response) => {
  try {
    const query = countryQuerySchema.parse(request.query);
    const result = await insightService.getSalaryByCountry(query);

    response.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        message: 'Validation failed',
        errors: formatValidationErrors(error),
      });
      return;
    }

    throw error;
  }
});

insightRouter.get('/job-title-average', async (request, response) => {
  try {
    const query = jobTitleAverageQuerySchema.parse(request.query);
    const result = await insightService.getJobTitleAverage(query);

    response.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        message: 'Validation failed',
        errors: formatValidationErrors(error),
      });
      return;
    }

    throw error;
  }
});

insightRouter.get('/summary', async (_request, response) => {
  const result = await insightService.getSummary();
  response.status(200).json(result);
});

insightRouter.get('/top-paying-job-titles', async (request, response) => {
  const limit = Number(request.query.limit ?? 5);
  const result = await insightService.getTopPayingJobTitles(limit);

  response.status(200).json(result);
});

insightRouter.get('/salary-distribution', async (request, response) => {
  try {
    const query = salaryDistributionQuerySchema.parse(request.query);
    const result = await insightService.getSalaryDistribution(query);

    response.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        message: 'Validation failed',
        errors: formatValidationErrors(error),
      });
      return;
    }

    throw error;
  }
});
