/* eslint-disable no-unused-vars */

'use client';

import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material';

import { formatCurrency, formatDate } from '../../lib/format';
import type { EmployeeRecord } from '../../lib/types';

type EmployeeTableProps = {
  employees: EmployeeRecord[];
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

const columns = [
  { key: 'fullName', label: 'Employee' },
  { key: 'jobTitle', label: 'Role' },
  { key: 'country', label: 'Country' },
  { key: 'salary', label: 'Salary' },
  { key: 'hireDate', label: 'Hire date' },
] as const;

export function EmployeeTable({
  employees,
  page,
  pageSize,
  totalItems,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <Stack spacing={2}>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2">{column.label}</Typography>
                    <IconButton
                      size="small"
                      aria-label={`Sort by ${column.label.toLowerCase()}`}
                      onClick={() => onSortChange(column.key)}
                    >
                      <Typography
                        component="span"
                        color={sortBy === column.key ? 'primary' : 'text.secondary'}
                        sx={{ fontSize: 16, lineHeight: 1 }}
                      >
                        ↕
                      </Typography>
                    </IconButton>
                    {sortBy === column.key ? (
                      <Typography variant="caption" color="primary">
                        {sortOrder.toUpperCase()}
                      </Typography>
                    ) : null}
                  </Stack>
                </TableCell>
              ))}
              <TableCell align="right">
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="h6">No employees found</Typography>
                    <Typography color="text.secondary">
                      Adjust the filters or add a new employee.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography fontWeight={600}>{employee.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.department}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{employee.country}</TableCell>
                  <TableCell>{formatCurrency(employee.salary, employee.currency)}</TableCell>
                  <TableCell>{formatDate(employee.hireDate)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton
                        aria-label={`Edit ${employee.fullName}`}
                        onClick={() => onEdit(employee.id)}
                      >
                        <Typography component="span" sx={{ fontSize: 13 }}>
                          Edit
                        </Typography>
                      </IconButton>
                      <IconButton
                        aria-label={`Delete ${employee.fullName}`}
                        onClick={() => onDelete(employee.id)}
                      >
                        <Typography component="span" sx={{ fontSize: 13 }}>
                          Delete
                        </Typography>
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography color="text.secondary">
          Page {page} of {totalPages}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            Previous page
          </Button>
          <Button
            variant="contained"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            Next page
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
