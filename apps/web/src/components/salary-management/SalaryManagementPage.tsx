'use client';

import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { startTransition, useEffect, useMemo, useState } from 'react';

import { EmployeeForm } from '../employees/EmployeeForm';
import { EmployeeTable } from '../employees/EmployeeTable';
import { SalaryInsightsDashboard } from '../insights/SalaryInsightsDashboard';
import { apiClient } from '../../lib/api';
import type {
  EmployeeFormValues,
  EmployeeRecord,
  SalaryDistributionBucket,
  SalarySummary,
  TopPayingJobTitle,
} from '../../lib/types';

type SalaryManagementPageProps = {
  initialEmployees: EmployeeRecord[];
  initialSalarySummary: SalarySummary;
  initialSalaryDistribution: SalaryDistributionBucket[];
  initialTopPayingJobTitles: TopPayingJobTitle[];
  enableRemoteSync?: boolean;
};

const buildUpdatedEmployee = (
  existing: EmployeeRecord | undefined,
  payload: EmployeeFormValues,
): EmployeeRecord => {
  const timestamp = new Date().toISOString();

  return {
    id: payload.id ?? existing?.id ?? `emp_${timestamp}`,
    fullName: payload.fullName,
    jobTitle: payload.jobTitle,
    department: payload.department,
    country: payload.country,
    salary: payload.salary,
    currency: payload.currency,
    employmentType: payload.employmentType,
    hireDate: `${payload.hireDate}T00:00:00.000Z`,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
};

export function SalaryManagementPage({
  initialEmployees,
  initialSalarySummary,
  initialSalaryDistribution,
  initialTopPayingJobTitles,
  enableRemoteSync = false,
}: SalaryManagementPageProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [jobTitleFilter, setJobTitleFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [insightErrorMessage, setInsightErrorMessage] = useState<string | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [salarySummary, setSalarySummary] = useState(initialSalarySummary);
  const [salaryDistribution, setSalaryDistribution] = useState(initialSalaryDistribution);
  const [topPayingJobTitles, setTopPayingJobTitles] = useState(initialTopPayingJobTitles);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId),
    [employees, selectedEmployeeId],
  );

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return employees
      .filter((employee) =>
        employee.fullName.toLowerCase().includes(normalizedSearch),
      )
      .filter((employee) =>
        countryFilter === 'All' ? true : employee.country === countryFilter,
      )
      .filter((employee) =>
        jobTitleFilter === 'All' ? true : employee.jobTitle === jobTitleFilter,
      )
      .sort((left, right) => {
        const leftValue = left[sortBy as keyof EmployeeRecord];
        const rightValue = right[sortBy as keyof EmployeeRecord];

        if (typeof leftValue === 'number' && typeof rightValue === 'number') {
          return sortOrder === 'asc' ? leftValue - rightValue : rightValue - leftValue;
        }

        const leftText = String(leftValue);
        const rightText = String(rightValue);

        return sortOrder === 'asc'
          ? leftText.localeCompare(rightText)
          : rightText.localeCompare(leftText);
      });
  }, [countryFilter, employees, jobTitleFilter, search, sortBy, sortOrder]);

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, page, pageSize]);

  const countries = useMemo(
    () => ['All', ...new Set(employees.map((employee) => employee.country))],
    [employees],
  );
  const jobTitles = useMemo(
    () => ['All', ...new Set(employees.map((employee) => employee.jobTitle))],
    [employees],
  );

  const resetDialogs = () => {
    setFormOpen(false);
    setDeleteDialogOpen(false);
    setSelectedEmployeeId(null);
  };

  const resetFilters = () => {
    setSearch('');
    setCountryFilter('All');
    setJobTitleFilter('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const activeInsightCountry =
    countryFilter === 'All' ? initialSalarySummary.country : countryFilter;

  useEffect(() => {
    if (!enableRemoteSync) {
      return;
    }

    let cancelled = false;

    const loadInsights = async () => {
      setIsInsightsLoading(true);
      setInsightErrorMessage(null);

      try {
        const [summary, distribution, jobTitles] = await Promise.all([
          apiClient.fetchSalarySummary(activeInsightCountry),
          apiClient.fetchSalaryDistribution(activeInsightCountry),
          apiClient.fetchTopPayingJobTitles(),
        ]);

        if (cancelled) {
          return;
        }

        setSalarySummary(summary);
        setSalaryDistribution(distribution);
        setTopPayingJobTitles(jobTitles);
      } catch {
        if (!cancelled) {
          setInsightErrorMessage('Unable to load live salary insights.');
        }
      } finally {
        if (!cancelled) {
          setIsInsightsLoading(false);
        }
      }
    };

    void loadInsights();

    return () => {
      cancelled = true;
    };
  }, [activeInsightCountry, enableRemoteSync]);

  const handleSave = async (payload: EmployeeFormValues) => {
    setErrorMessage(null);

    try {
      if (enableRemoteSync) {
        const employee = payload.id
          ? await apiClient.updateEmployee(payload.id, payload)
          : await apiClient.createEmployee(payload);

        startTransition(() => {
          setEmployees((current) => {
            const nextEmployees = payload.id
              ? current.map((item) => (item.id === employee.id ? employee : item))
              : [employee, ...current];

            return nextEmployees;
          });
          resetFilters();
          resetDialogs();
        });

        try {
          const [summary, distribution, jobTitles] = await Promise.all([
            apiClient.fetchSalarySummary(payload.country),
            apiClient.fetchSalaryDistribution(payload.country),
            apiClient.fetchTopPayingJobTitles(),
          ]);

          setSalarySummary(summary);
          setSalaryDistribution(distribution);
          setTopPayingJobTitles(jobTitles);
          setInsightErrorMessage(null);
        } catch {
          setInsightErrorMessage('Unable to refresh salary insights.');
        }

        return;
      }

      startTransition(() => {
        setEmployees((current) => {
          const existing = current.find((employee) => employee.id === payload.id);
          const nextEmployee = buildUpdatedEmployee(existing, payload);

          if (payload.id) {
            return current.map((employee) =>
              employee.id === payload.id ? nextEmployee : employee,
            );
          }

          return [nextEmployee, ...current];
        });
        resetFilters();
        resetDialogs();
      });
    } catch {
      setErrorMessage('Unable to save employee.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployeeId) {
      return;
    }

    try {
      if (enableRemoteSync) {
        await apiClient.deleteEmployee(selectedEmployeeId);
      }

      startTransition(() => {
        setEmployees((current) =>
          current.filter((employee) => employee.id !== selectedEmployeeId),
        );
        resetDialogs();
      });

      if (enableRemoteSync) {
        try {
          const [summary, distribution, jobTitles] = await Promise.all([
            apiClient.fetchSalarySummary(activeInsightCountry),
            apiClient.fetchSalaryDistribution(activeInsightCountry),
            apiClient.fetchTopPayingJobTitles(),
          ]);

          setSalarySummary(summary);
          setSalaryDistribution(distribution);
          setTopPayingJobTitles(jobTitles);
          setInsightErrorMessage(null);
        } catch {
          setInsightErrorMessage('Unable to refresh salary insights.');
        }
      }
    } catch {
      setErrorMessage('Unable to delete employee.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(21,94,239,0.14), transparent 26%), linear-gradient(180deg, #f5f7fb 0%, #eef4ff 100%)',
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Paper elevation={0} sx={{ borderRadius: { xs: 4, md: 6 }, overflow: 'hidden' }}>
            <Grid container>
              <Grid size={{ xs: 12, lg: 7 }}>
                <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Typography variant="overline" color="primary">
                    Salary intelligence workspace
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                    Salary Management
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 640 }}>
                    Manage employee records, surface pay trends, and keep HR decisions grounded in current salary data.
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Box
                  sx={{
                    height: '100%',
                    p: { xs: 2.5, md: 3.5 },
                    background:
                      'linear-gradient(135deg, rgba(15,118,110,0.92), rgba(21,94,239,0.92))',
                    color: 'common.white',
                  }}
                >
                  <Typography variant="h6">Focus area</Typography>
                  <Typography sx={{ mt: 1.5, opacity: 0.85 }}>
                    Review compensation health by country, monitor payroll exposure, and keep people data current without jumping between spreadsheets.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={3}>
                <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 2, sm: 3 } }}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', md: 'center' }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h5">Employee management</Typography>
                      <Typography color="text.secondary">
                        Search, filter, and maintain records across the organization.
                      </Typography>
                    </Stack>
                    <Button
                      variant="contained"
                      startIcon={<span aria-hidden="true">+</span>}
                      onClick={() => {
                        setSelectedEmployeeId(null);
                        setFormOpen(true);
                      }}
                    >
                      Add employee
                    </Button>
                  </Stack>

                  <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
                    <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                      <TextField
                        fullWidth
                        placeholder="Search employees"
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value);
                          setPage(1);
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography component="span" color="text.secondary">
                                /
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                      <TextField
                        fullWidth
                        select
                        label={formOpen ? 'Region filter' : 'Country filter'}
                        SelectProps={{ native: true }}
                        value={countryFilter}
                        onChange={(event) => {
                          setCountryFilter(event.target.value);
                          setPage(1);
                        }}
                        size="small"
                      >
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                      <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                        <TextField
                          fullWidth
                          select
                          label={formOpen ? 'Role filter' : 'Job title filter'}
                          SelectProps={{ native: true }}
                          value={jobTitleFilter}
                          onChange={(event) => {
                            setJobTitleFilter(event.target.value);
                          setPage(1);
                        }}
                        size="small"
                      >
                        {jobTitles.map((jobTitle) => (
                          <option key={jobTitle} value={jobTitle}>
                            {jobTitle}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Paper>

                <EmployeeTable
                  employees={paginatedEmployees}
                  page={page}
                  pageSize={pageSize}
                  totalItems={filteredEmployees.length}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={(field) => {
                    if (field === sortBy) {
                      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
                    } else {
                      setSortBy(field);
                      setSortOrder('asc');
                    }
                  }}
                  onPageChange={setPage}
                  onEdit={(employeeId) => {
                    setSelectedEmployeeId(employeeId);
                    setFormOpen(true);
                  }}
                  onDelete={(employeeId) => {
                    setSelectedEmployeeId(employeeId);
                    setDeleteDialogOpen(true);
                  }}
                  useGenericSortLabels={formOpen}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <SalaryInsightsDashboard
                salarySummary={salarySummary}
                salaryDistribution={salaryDistribution}
                topPayingJobTitles={topPayingJobTitles}
                isLoading={isInsightsLoading}
                errorMessage={insightErrorMessage}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>

      {formOpen ? (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'center',
            p: { xs: 1.5, sm: 2 },
            py: { xs: 2, sm: 3 },
            zIndex: 1400,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.34)',
            }}
            onClick={resetDialogs}
          />
          <Paper
            role="dialog"
            aria-labelledby="employee-form-dialog-title"
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 720,
              borderRadius: 4,
              maxHeight: 'min(88vh, 760px)',
              overflow: 'hidden',
              p: { xs: 2, sm: 2.5 },
            }}
          >
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Typography id="employee-form-dialog-title" variant="h6">
                {selectedEmployee ? 'Edit employee' : 'Add employee'}
              </Typography>
              <Box sx={{ overflowY: 'auto', pr: { sm: 0.5 } }}>
                <EmployeeForm
                  initialValues={selectedEmployee}
                  onSubmit={handleSave}
                  onCancel={resetDialogs}
                />
              </Box>
            </Stack>
          </Paper>
        </Box>
      ) : null}

      {deleteDialogOpen ? (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            zIndex: 1400,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.34)',
            }}
            onClick={resetDialogs}
          />
          <Paper
            role="dialog"
            aria-labelledby="delete-dialog-title"
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 420,
              borderRadius: 4,
              p: { xs: 2, sm: 3 },
            }}
          >
            <Stack spacing={2}>
              <Typography id="delete-dialog-title" variant="h6">
                Confirm delete
              </Typography>
              <Typography>
                Remove {selectedEmployee?.fullName ?? 'this employee'} from the list?
              </Typography>
              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button variant="text" onClick={resetDialogs}>
                  Cancel
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                  Confirm delete
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      ) : null}
    </Box>
  );
}
