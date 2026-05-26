export type EmployeeRecord = {
  id: string;
  fullName: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
};

export type SalarySummary = {
  country: string;
  employeeCount: number;
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
  medianSalary: number;
  totalPayroll: number;
};

export const employeeFixtures: EmployeeRecord[] = [
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
];

export const salarySummaryFixture: SalarySummary = {
  country: 'India',
  employeeCount: 2,
  minSalary: 125000,
  maxSalary: 185000,
  averageSalary: 155000,
  medianSalary: 155000,
  totalPayroll: 310000,
};

export const salaryDistributionFixture = [
  { bucketStart: 100000, bucketEnd: 124999, employeeCount: 4 },
  { bucketStart: 125000, bucketEnd: 149999, employeeCount: 7 },
  { bucketStart: 150000, bucketEnd: 174999, employeeCount: 3 },
];
