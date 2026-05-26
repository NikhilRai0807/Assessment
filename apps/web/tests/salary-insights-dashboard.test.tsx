/* eslint-disable no-unused-vars */

import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';

import {
  salaryDistributionFixture,
  salarySummaryFixture,
} from './support/fixtures';
import { renderWithProviders } from './support/renderWithProviders';

type SalaryInsightsDashboardProps = {
  salarySummary: typeof salarySummaryFixture;
  salaryDistribution: typeof salaryDistributionFixture;
  topPayingJobTitles: Array<{ jobTitle: string; averageSalary: number; employeeCount: number }>;
  isLoading?: boolean;
  errorMessage?: string | null;
};

const loadSalaryInsightsDashboard = (): ((
  props: SalaryInsightsDashboardProps,
) => ReactElement) => {
  const moduleExports = require('../src/components/insights/SalaryInsightsDashboard') as {
    SalaryInsightsDashboard: (props: SalaryInsightsDashboardProps) => ReactElement;
  };

  return moduleExports.SalaryInsightsDashboard;
};

describe('SalaryInsightsDashboard', () => {
  it('renders summary metrics, top-paying roles, and chart content', () => {
    const SalaryInsightsDashboard = loadSalaryInsightsDashboard();

    renderWithProviders(
      <SalaryInsightsDashboard
        salarySummary={salarySummaryFixture}
        salaryDistribution={salaryDistributionFixture}
        topPayingJobTitles={[
          { jobTitle: 'Product Manager', averageSalary: 210000, employeeCount: 6 },
          { jobTitle: 'Software Engineer', averageSalary: 175000, employeeCount: 14 },
        ]}
      />,
    );

    expect(screen.getByText(/employee count/i)).toBeInTheDocument();
    expect(screen.getByText(/total payroll/i)).toBeInTheDocument();
    expect(screen.getByText(/product manager/i)).toBeInTheDocument();
    expect(screen.getByText(/salary distribution/i)).toBeInTheDocument();
  });

  it('renders loading and error states', () => {
    const SalaryInsightsDashboard = loadSalaryInsightsDashboard();

    const { rerender } = renderWithProviders(
      <SalaryInsightsDashboard
        salarySummary={salarySummaryFixture}
        salaryDistribution={salaryDistributionFixture}
        topPayingJobTitles={[]}
        isLoading
      />,
    );

    expect(screen.getByText(/loading salary insights/i)).toBeInTheDocument();

    rerender(
      <SalaryInsightsDashboard
        salarySummary={salarySummaryFixture}
        salaryDistribution={salaryDistributionFixture}
        topPayingJobTitles={[]}
        errorMessage="Unable to load salary insights."
      />,
    );

    expect(screen.getByText(/unable to load salary insights/i)).toBeInTheDocument();
  });
});
