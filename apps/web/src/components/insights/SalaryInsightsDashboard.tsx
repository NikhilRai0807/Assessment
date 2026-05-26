'use client';

import {
  Alert,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatCompactNumber, formatCurrency } from '../../lib/format';
import type {
  SalaryDistributionBucket,
  SalarySummary,
  TopPayingJobTitle,
} from '../../lib/types';

type SalaryInsightsDashboardProps = {
  salarySummary: SalarySummary;
  salaryDistribution: SalaryDistributionBucket[];
  topPayingJobTitles: TopPayingJobTitle[];
  isLoading?: boolean;
  errorMessage?: string | null;
};

export function SalaryInsightsDashboard({
  salarySummary,
  salaryDistribution,
  topPayingJobTitles,
  isLoading = false,
  errorMessage = null,
}: SalaryInsightsDashboardProps) {
  if (isLoading) {
    return (
      <Paper elevation={0} sx={{ borderRadius: 4, p: 3 }}>
        <Typography>Loading salary insights...</Typography>
      </Paper>
    );
  }

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {[
          { label: 'Employee count', value: salarySummary.employeeCount.toString() },
          {
            label: 'Total payroll',
            value: formatCurrency(salarySummary.totalPayroll, salarySummary.country === 'India' ? 'INR' : 'USD'),
          },
          {
            label: 'Average salary',
            value: formatCurrency(salarySummary.averageSalary, salarySummary.country === 'India' ? 'INR' : 'USD'),
          },
          {
            label: 'Median salary',
            value: formatCurrency(salarySummary.medianSalary, salarySummary.country === 'India' ? 'INR' : 'USD'),
          },
        ].map((metric) => (
          <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card elevation={0} sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Salary distribution
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salaryDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="bucketStart" tickFormatter={(value) => formatCompactNumber(Number(value))} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="employeeCount" fill="#155eef" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top-paying job titles
            </Typography>
            <Stack spacing={2}>
              {topPayingJobTitles.map((jobTitle) => (
                <Stack key={jobTitle.jobTitle} spacing={0.5}>
                  <Typography fontWeight={600}>{jobTitle.jobTitle}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Average {formatCompactNumber(jobTitle.averageSalary)} across {jobTitle.employeeCount} employees
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
