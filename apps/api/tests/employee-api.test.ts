import request from 'supertest';

import { createApp } from '../src/app/createApp';
import {
  secondEmployeePayload,
  validEmployeePayload,
} from './support/employeePayloads';

describe('employee management API', () => {
  it('creates an employee', async () => {
    const response = await request(createApp())
      .post('/employees')
      .send(validEmployeePayload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      ...validEmployeePayload,
      hireDate: expect.stringMatching(/^2024-01-15/),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('updates an employee', async () => {
    const app = createApp();
    const created = await request(app).post('/employees').send(validEmployeePayload);

    expect(created.status).toBe(201);

    const response = await request(app)
      .patch(`/employees/${created.body.id}`)
      .send({
        jobTitle: 'Senior Software Engineer',
        salary: 205000,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: created.body.id,
      fullName: validEmployeePayload.fullName,
      jobTitle: 'Senior Software Engineer',
      salary: 205000,
    });
  });

  it('deletes an employee', async () => {
    const app = createApp();
    const created = await request(app)
      .post('/employees')
      .send(secondEmployeePayload);

    expect(created.status).toBe(201);

    const deleted = await request(app).delete(`/employees/${created.body.id}`);
    const fetched = await request(app).get(`/employees/${created.body.id}`);

    expect(deleted.status).toBe(204);
    expect(fetched.status).toBe(404);
  });
});
