import { SalaryManagementPage } from '../components/salary-management/SalaryManagementPage';

export default function HomePage() {
  return (
    <SalaryManagementPage
      enableRemoteSync
      initialEmployees={[
        {
          id: 'emp_1',
          fullName: 'Ava Thompson',
          jobTitle: 'Software Engineer',
          department: 'Engineering',
          country: 'India',
          salary: 185000,
          currency: 'INR',
          employmentType: 'FULL_TIME',
          hireDate: '2024-01-15T00:00:00.000Z',
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
        },
        {
          id: 'emp_2',
          fullName: 'Liam Patel',
          jobTitle: 'HR Manager',
          department: 'People Operations',
          country: 'United States',
          salary: 145000,
          currency: 'USD',
          employmentType: 'FULL_TIME',
          hireDate: '2023-08-01T00:00:00.000Z',
          createdAt: '2023-08-01T00:00:00.000Z',
          updatedAt: '2023-08-01T00:00:00.000Z',
        },
      ]}
      initialSalarySummary={{
        country: 'India',
        employeeCount: 2,
        minSalary: 125000,
        maxSalary: 185000,
        averageSalary: 155000,
        medianSalary: 155000,
        totalPayroll: 310000,
      }}
      initialSalaryDistribution={[
        { bucketStart: 100000, bucketEnd: 124999, employeeCount: 4 },
        { bucketStart: 125000, bucketEnd: 149999, employeeCount: 7 },
        { bucketStart: 150000, bucketEnd: 174999, employeeCount: 3 },
      ]}
      initialTopPayingJobTitles={[
        { jobTitle: 'Product Manager', averageSalary: 210000, employeeCount: 6 },
        { jobTitle: 'Software Engineer', averageSalary: 175000, employeeCount: 14 },
      ]}
    />
  );
}
