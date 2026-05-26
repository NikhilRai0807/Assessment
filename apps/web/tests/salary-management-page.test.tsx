/* eslint-disable no-unused-vars */

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

import {
  employeeFixtures,
  salaryDistributionFixture,
  salarySummaryFixture,
} from './support/fixtures';
import { renderWithProviders } from './support/renderWithProviders';

type SalaryManagementPageProps = {
  initialEmployees: typeof employeeFixtures;
  initialSalarySummary: typeof salarySummaryFixture;
  initialSalaryDistribution: typeof salaryDistributionFixture;
  initialTopPayingJobTitles: Array<{ jobTitle: string; averageSalary: number; employeeCount: number }>;
};

const loadSalaryManagementPage = (): ((
  props: SalaryManagementPageProps,
) => ReactElement) => {
  const moduleExports = require('../src/components/salary-management/SalaryManagementPage') as {
    SalaryManagementPage: (props: SalaryManagementPageProps) => ReactElement;
  };

  return moduleExports.SalaryManagementPage;
};

describe('SalaryManagementPage', () => {
  it('supports search, filters, add/edit flow, delete flow, and pagination', async () => {
    const user = userEvent.setup();
    const SalaryManagementPage = loadSalaryManagementPage();

    renderWithProviders(
      <SalaryManagementPage
        initialEmployees={employeeFixtures}
        initialSalarySummary={salarySummaryFixture}
        initialSalaryDistribution={salaryDistributionFixture}
        initialTopPayingJobTitles={[
          { jobTitle: 'Software Engineer', averageSalary: 175000, employeeCount: 14 },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: /salary management/i })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search employees/i), 'Ava');
    await user.selectOptions(screen.getByLabelText(/country filter/i), 'India');
    await user.selectOptions(screen.getByLabelText(/job title filter/i), 'Software Engineer');
    await user.click(screen.getByRole('button', { name: /add employee/i }));

    expect(screen.getByRole('dialog', { name: /add employee/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/full name/i), 'Noah Garcia');
    await user.type(screen.getByLabelText(/job title/i), 'Finance Specialist');
    await user.type(screen.getByLabelText(/department/i), 'Finance');
    await user.type(screen.getByLabelText(/country/i), 'Canada');
    await user.type(screen.getByLabelText(/salary/i), '132000');
    await user.type(screen.getByLabelText(/currency/i), 'CAD');
    await user.selectOptions(screen.getByLabelText(/employment type/i), 'FULL_TIME');
    await user.type(screen.getByLabelText(/hire date/i), '2024-05-12');
    await user.click(screen.getByRole('button', { name: /save employee/i }));

    await waitFor(() => {
      expect(screen.getByText(/noah garcia/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /edit ava thompson/i }));
    expect(screen.getByRole('dialog', { name: /edit employee/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /delete liam patel/i }));
    expect(screen.getByRole('dialog', { name: /confirm delete/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /confirm delete/i }));

    await waitFor(() => {
      expect(screen.queryByText('Liam Patel')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /next page/i }));
  });
});
