/* eslint-disable no-unused-vars */

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

import { employeeFixtures } from './support/fixtures';
import { renderWithProviders } from './support/renderWithProviders';

type EmployeeFormProps = {
  initialValues?: typeof employeeFixtures[number];
  onSubmit: (payload: Record<string, unknown>) => void | Promise<void>;
  onCancel: () => void;
};

const loadEmployeeForm = (): ((props: EmployeeFormProps) => ReactElement) => {
  const moduleExports = require('../src/components/employees/EmployeeForm') as {
    EmployeeForm: (props: EmployeeFormProps) => ReactElement;
  };

  return moduleExports.EmployeeForm;
};

describe('EmployeeForm', () => {
  it('submits a new employee with validated values', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const EmployeeForm = loadEmployeeForm();

    renderWithProviders(<EmployeeForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    await user.type(screen.getByLabelText(/full name/i), 'Mia Thompson');
    await user.type(screen.getByLabelText(/job title/i), 'Data Analyst');
    await user.type(screen.getByLabelText(/department/i), 'Analytics');
    await user.type(screen.getByLabelText(/country/i), 'India');
    await user.type(screen.getByLabelText(/salary/i), '165000');
    await user.type(screen.getByLabelText(/currency/i), 'INR');
    await user.selectOptions(screen.getByLabelText(/employment type/i), 'FULL_TIME');
    await user.type(screen.getByLabelText(/hire date/i), '2024-04-01');
    await user.click(screen.getByRole('button', { name: /save employee/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Mia Thompson',
          jobTitle: 'Data Analyst',
          country: 'India',
          salary: 165000,
        }),
      );
    });
  });

  it('shows validation and supports editing an existing employee', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const EmployeeForm = loadEmployeeForm();

    renderWithProviders(
      <EmployeeForm
        initialValues={employeeFixtures[0]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />,
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.click(screen.getByRole('button', { name: /save employee/i }));

    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();

    await user.type(fullNameInput, 'Ava Thompson');
    await user.clear(screen.getByLabelText(/salary/i));
    await user.type(screen.getByLabelText(/salary/i), '205000');
    await user.click(screen.getByRole('button', { name: /save employee/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'emp_1',
          salary: 205000,
        }),
      );
    });
  });
});
