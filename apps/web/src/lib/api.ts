import type {
  EmployeeFormValues,
  EmployeeListResponse,
  EmployeeRecord,
  SalaryDistributionBucket,
  SalarySummary,
  TopPayingJobTitle,
} from './types';

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = response.status >= 500 ? 'Request failed' : 'Unable to complete request';
    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export const apiClient = {
  async fetchEmployees(params: URLSearchParams) {
    const response = await fetch(`${getApiBaseUrl()}/employees?${params.toString()}`, {
      cache: 'no-store',
    });

    return handleResponse<EmployeeListResponse>(response);
  },

  async createEmployee(payload: EmployeeFormValues) {
    const response = await fetch(`${getApiBaseUrl()}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<EmployeeRecord>(response);
  },

  async updateEmployee(employeeId: string, payload: EmployeeFormValues) {
    const response = await fetch(`${getApiBaseUrl()}/employees/${employeeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<EmployeeRecord>(response);
  },

  async deleteEmployee(employeeId: string) {
    const response = await fetch(`${getApiBaseUrl()}/employees/${employeeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Unable to delete employee');
    }
  },

  async fetchSalarySummary(country: string) {
    const response = await fetch(
      `${getApiBaseUrl()}/insights/salary-by-country?country=${encodeURIComponent(country)}`,
      { cache: 'no-store' },
    );

    return handleResponse<SalarySummary>(response);
  },

  async fetchSalaryDistribution(country: string) {
    const response = await fetch(
      `${getApiBaseUrl()}/insights/salary-distribution?country=${encodeURIComponent(country)}`,
      { cache: 'no-store' },
    );

    return handleResponse<SalaryDistributionBucket[]>(response);
  },

  async fetchTopPayingJobTitles() {
    const response = await fetch(`${getApiBaseUrl()}/insights/top-paying-job-titles`, {
      cache: 'no-store',
    });

    return handleResponse<TopPayingJobTitle[]>(response);
  },

  async fetchSalarySummaryOverview() {
    const response = await fetch(`${getApiBaseUrl()}/insights/summary`, {
      cache: 'no-store',
    });

    return handleResponse<{
      employeeCount: number;
      totalPayroll: number;
      averageSalary: number;
      minSalary: number;
      maxSalary: number;
    }>(response);
  },
};
