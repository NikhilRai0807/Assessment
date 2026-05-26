import request from 'supertest';

import { createApp } from '../src/app/createApp';
import {
  secondEmployeePayload,
  validEmployeePayload,
} from './support/employeePayloads';

describe('employee listing', () => {
  it('returns paginated employees with metadata', async () => {
    const app = createApp();

    await request(app).post('/employees').send(validEmployeePayload);
    await request(app).post('/employees').send(secondEmployeePayload);

    const response = await request(app).get(
      '/employees?page=1&pageSize=1&sortBy=salary&sortOrder=desc',
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      items: [expect.objectContaining({ fullName: validEmployeePayload.fullName })],
      page: 1,
      pageSize: 1,
      totalItems: 2,
      totalPages: 2,
    });
  });

  it('filters by country and job title and searches by name', async () => {
    const app = createApp();

    await request(app).post('/employees').send(validEmployeePayload);
    await request(app).post('/employees').send(secondEmployeePayload);

    const response = await request(app).get(
      '/employees?search=ava&country=India&jobTitle=Software Engineer',
    );

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0]).toMatchObject({
      fullName: 'Ava Thompson',
      country: 'India',
      jobTitle: 'Software Engineer',
    });
  });
});
