/* eslint-disable no-unused-vars */

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

import { employeeFixtures } from './support/fixtures';
import { renderWithProviders } from './support/renderWithProviders';

type EmployeeTableProps = {
  employees: typeof employeeFixtures;
  page: number;
  pageSize: number;
  totalItems: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (employeeId: string) => void;
  onDelete: (employeeId: string) => void;
};

const loadEmployeeTable = (): ((props: EmployeeTableProps) => ReactElement) => {
  const moduleExports = require('../src/components/employees/EmployeeTable') as {
    EmployeeTable: (props: EmployeeTableProps) => ReactElement;
  };

  return moduleExports.EmployeeTable;
};

describe('EmployeeTable', () => {
  it('renders employees and supports sorting, edit, delete, and pagination', async () => {
    const user = userEvent.setup();
    const onSortChange = jest.fn();
    const onPageChange = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const EmployeeTable = loadEmployeeTable();

    renderWithProviders(
      <EmployeeTable
        employees={employeeFixtures}
        page={1}
        pageSize={1}
        totalItems={2}
        sortBy="salary"
        sortOrder="desc"
        onSortChange={onSortChange}
        onPageChange={onPageChange}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('Ava Thompson')).toBeInTheDocument();
    expect(screen.getByText('Liam Patel')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sort by salary/i }));
    await user.click(screen.getByRole('button', { name: /edit ava thompson/i }));
    await user.click(screen.getByRole('button', { name: /delete ava thompson/i }));
    await user.click(screen.getByRole('button', { name: /next page/i }));

    expect(onSortChange).toHaveBeenCalledWith('salary');
    expect(onEdit).toHaveBeenCalledWith('emp_1');
    expect(onDelete).toHaveBeenCalledWith('emp_1');
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders an empty state when there are no employees', () => {
    const EmployeeTable = loadEmployeeTable();

    renderWithProviders(
      <EmployeeTable
        employees={[]}
        page={1}
        pageSize={10}
        totalItems={0}
        sortBy="createdAt"
        sortOrder="asc"
        onSortChange={jest.fn()}
        onPageChange={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText(/no employees found/i)).toBeInTheDocument();
  });
});
