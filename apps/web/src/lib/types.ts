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

export type EmployeeFormValues = {
  id?: string;
  fullName: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: string;
  hireDate: string;
};

export type EmployeeListResponse = {
  items: EmployeeRecord[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
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

export type SalaryDistributionBucket = {
  bucketStart: number;
  bucketEnd: number;
  employeeCount: number;
};

export type TopPayingJobTitle = {
  jobTitle: string;
  averageSalary: number;
  employeeCount: number;
};
