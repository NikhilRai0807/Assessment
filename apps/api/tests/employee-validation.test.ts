import request from 'supertest';

import { createApp } from '../src/app/createApp';

describe('employee validation', () => {
  it('rejects invalid employee payloads', async () => {
    const response = await request(createApp()).post('/employees').send({
      fullName: '',
      jobTitle: '',
      department: '',
      country: '',
      salary: -1,
      currency: 'US',
      employmentType: 'INVALID',
      hireDate: 'not-a-date',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: 'Validation failed',
      errors: expect.arrayContaining([
        expect.objectContaining({ field: 'fullName' }),
        expect.objectContaining({ field: 'salary' }),
        expect.objectContaining({ field: 'employmentType' }),
      ]),
    });
  });
});
