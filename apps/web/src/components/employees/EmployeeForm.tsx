/* eslint-disable no-unused-vars */

'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';

import type { EmployeeFormValues, EmployeeRecord } from '../../lib/types';

type EmployeeFormProps = {
  initialValues?: EmployeeRecord;
  onSubmit: (payload: EmployeeFormValues) => void | Promise<void>;
  onCancel: () => void;
};

type FormErrors = Partial<Record<keyof EmployeeFormValues, string>>;

const defaultValues: EmployeeFormValues = {
  fullName: '',
  jobTitle: '',
  department: '',
  country: '',
  salary: 0,
  currency: '',
  employmentType: 'FULL_TIME',
  hireDate: '',
};

const toFormValues = (values?: EmployeeRecord): EmployeeFormValues =>
  values
    ? {
        id: values.id,
        fullName: values.fullName,
        jobTitle: values.jobTitle,
        department: values.department,
        country: values.country,
        salary: values.salary,
        currency: values.currency,
        employmentType: values.employmentType,
        hireDate: values.hireDate.slice(0, 10),
      }
    : defaultValues;

export function EmployeeForm({ initialValues, onSubmit, onCancel }: EmployeeFormProps) {
  const [values, setValues] = useState<EmployeeFormValues>(toFormValues(initialValues));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setValues(toFormValues(initialValues));
    setErrors({});
  }, [initialValues]);

  const handleChange =
    (field: keyof EmployeeFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue =
        field === 'salary' ? Number(event.target.value || 0) : event.target.value;

      setValues((current) => ({
        ...current,
        [field]: nextValue,
      }));
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = 'full name is required';
    }

    if (!values.jobTitle.trim()) {
      nextErrors.jobTitle = 'job title is required';
    }

    if (!values.department.trim()) {
      nextErrors.department = 'department is required';
    }

    if (!values.country.trim()) {
      nextErrors.country = 'country is required';
    }

    if (values.salary <= 0) {
      nextErrors.salary = 'salary must be greater than 0';
    }

    if (!values.currency.trim()) {
      nextErrors.currency = 'currency is required';
    }

    if (!values.hireDate.trim()) {
      nextErrors.hireDate = 'hire date is required';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      jobTitle: values.jobTitle.trim(),
      department: values.department.trim(),
      country: values.country.trim(),
      currency: values.currency.trim().toUpperCase(),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        {Object.keys(errors).length > 0 ? (
          <Alert severity="error">Please fix the highlighted fields.</Alert>
        ) : null}

        <TextField
          label="Full name"
          value={values.fullName}
          onChange={handleChange('fullName')}
          error={Boolean(errors.fullName)}
          helperText={errors.fullName}
          fullWidth
        />
        <TextField
          label="Job title"
          value={values.jobTitle}
          onChange={handleChange('jobTitle')}
          error={Boolean(errors.jobTitle)}
          helperText={errors.jobTitle}
          fullWidth
        />
        <TextField
          label="Department"
          value={values.department}
          onChange={handleChange('department')}
          error={Boolean(errors.department)}
          helperText={errors.department}
          fullWidth
        />
        <TextField
          label="Country"
          value={values.country}
          onChange={handleChange('country')}
          error={Boolean(errors.country)}
          helperText={errors.country}
          fullWidth
        />
        <TextField
          label="Salary"
          type="number"
          value={values.salary === 0 ? '' : values.salary}
          onChange={handleChange('salary')}
          error={Boolean(errors.salary)}
          helperText={errors.salary}
          fullWidth
        />
        <TextField
          label="Currency"
          value={values.currency}
          onChange={handleChange('currency')}
          error={Boolean(errors.currency)}
          helperText={errors.currency}
          fullWidth
        />
        <TextField
          label="Employment type"
          select
          SelectProps={{ native: true }}
          value={values.employmentType}
          onChange={handleChange('employmentType')}
          fullWidth
        >
          <option value="FULL_TIME">FULL_TIME</option>
          <option value="PART_TIME">PART_TIME</option>
          <option value="CONTRACTOR">CONTRACTOR</option>
          <option value="INTERN">INTERN</option>
        </TextField>
        <TextField
          label="Hire date"
          type="date"
          value={values.hireDate}
          onChange={handleChange('hireDate')}
          error={Boolean(errors.hireDate)}
          helperText={errors.hireDate}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button variant="text" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Save employee
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
