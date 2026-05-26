import cors from 'cors';
import express from 'express';

import { employeeRouter } from '../features/employees/employeeRouter';
import { insightRouter } from '../features/insights/insightRouter';
import { healthRouter } from '../routes/healthRouter';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/employees', employeeRouter);
  app.use('/insights', insightRouter);

  app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
    void next;
    console.error(error);
    response.status(500).json({
      message: 'Internal server error',
    });
  });

  return app;
};
