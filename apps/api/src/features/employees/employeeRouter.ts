import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { ZodError } from 'zod';

import {
  employeeCreateSchema,
  employeeListQuerySchema,
  employeeUpdateSchema,
} from './employeeSchemas';
import { employeeService } from './employeeService';

const formatValidationErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

const isPrismaNotFoundError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

export const employeeRouter = Router();

employeeRouter.post('/', async (request, response) => {
  try {
    const payload = employeeCreateSchema.parse(request.body);
    const employee = await employeeService.createEmployee(payload);

    response.status(201).json(employee);
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

employeeRouter.get('/', async (request, response) => {
  try {
    const query = employeeListQuerySchema.parse(request.query);
    const result = await employeeService.listEmployees(query);

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

employeeRouter.get('/:id', async (request, response) => {
  const employee = await employeeService.getEmployeeById(request.params.id);

  if (!employee) {
    response.status(404).json({ message: 'Employee not found' });
    return;
  }

  response.status(200).json(employee);
});

employeeRouter.patch('/:id', async (request, response) => {
  try {
    const payload = employeeUpdateSchema.parse(request.body);
    const employee = await employeeService.updateEmployee(request.params.id, payload);

    response.status(200).json(employee);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        message: 'Validation failed',
        errors: formatValidationErrors(error),
      });
      return;
    }

    if (isPrismaNotFoundError(error)) {
      response.status(404).json({ message: 'Employee not found' });
      return;
    }

    throw error;
  }
});

employeeRouter.delete('/:id', async (request, response) => {
  try {
    await employeeService.deleteEmployee(request.params.id);
    response.status(204).send();
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      response.status(404).json({ message: 'Employee not found' });
      return;
    }

    throw error;
  }
});
