import request from 'supertest';

import { createApp } from '../src/app/createApp';
import {
  secondEmployeePayload,
  validEmployeePayload,
} from './support/employeePayloads';

describe('salary insights API', () => {
  it('returns salary summary metrics by country', async () => {
    const app = createApp();

    await request(app).post('/employees').send(validEmployeePayload);
    await request(app)
      .post('/employees')
      .send({
        ...secondEmployeePayload,
        country: 'India',
        jobTitle: 'Software Engineer',
        salary: 125000,
        currency: 'INR',
      });

    const response = await request(app).get('/insights/salary-by-country?country=India');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      country: 'India',
      employeeCount: 2,
      minSalary: 125000,
      maxSalary: 185000,
      averageSalary: 155000,
      medianSalary: 155000,
      totalPayroll: 310000,
    });
  });

  it('returns average salary for a job title in a country', async () => {
    const app = createApp();

    await request(app).post('/employees').send(validEmployeePayload);
    await request(app)
      .post('/employees')
      .send({
        ...secondEmployeePayload,
        fullName: 'Mia Thompson',
        country: 'India',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        salary: 165000,
        currency: 'INR',
      });

    const response = await request(app).get(
      '/insights/job-title-average?country=India&jobTitle=Software%20Engineer',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      country: 'India',
      jobTitle: 'Software Engineer',
      averageSalary: 175000,
    });
  });
});
