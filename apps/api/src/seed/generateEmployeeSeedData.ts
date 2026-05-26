type SeedEmployee = {
  fullName: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN';
  hireDate: string;
  createdAt: Date;
  updatedAt: Date;
};

type SeedGenerationResult = {
  employees: SeedEmployee[];
  totalCount: number;
  batchCount: number;
};

const countries = [
  { name: 'India', currency: 'INR', salaryBase: 850000 },
  { name: 'United States', currency: 'USD', salaryBase: 95000 },
  { name: 'Germany', currency: 'EUR', salaryBase: 70000 },
  { name: 'Canada', currency: 'CAD', salaryBase: 90000 },
  { name: 'United Kingdom', currency: 'GBP', salaryBase: 62000 },
];

const jobs = [
  { title: 'Software Engineer', department: 'Engineering', premium: 22000 },
  { title: 'HR Manager', department: 'People Operations', premium: 12000 },
  { title: 'Product Manager', department: 'Product', premium: 26000 },
  { title: 'Data Analyst', department: 'Analytics', premium: 15000 },
  { title: 'Sales Executive', department: 'Sales', premium: 10000 },
  { title: 'Finance Specialist', department: 'Finance', premium: 14000 },
];

const employmentTypes: SeedEmployee['employmentType'][] = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACTOR',
  'INTERN',
];

const pick = <T>(items: T[], index: number) => items[index % items.length];

export const generateEmployeeSeedData = (
  firstNames: string[],
  lastNames: string[],
  count: number,
  batchSize: number,
): SeedGenerationResult => {
  const employees: SeedEmployee[] = [];

  for (let index = 0; index < count; index += 1) {
    const firstName = pick(firstNames, index);
    const lastName = pick(lastNames, Math.floor(index / Math.max(1, firstNames.length)));
    const country = pick(countries, index);
    const job = pick(jobs, index * 3);
    const employmentType = pick(employmentTypes, index * 5);
    const salary =
      country.salaryBase +
      job.premium +
      (index % 17) * 1250 +
      Math.floor(index / jobs.length) % 9 * 700;
    const year = 2017 + (index % 8);
    const month = (index % 12) + 1;
    const day = (index % 27) + 1;
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const timestamp = new Date(`${isoDate}T00:00:00.000Z`);

    employees.push({
      fullName: `${firstName} ${lastName}`,
      jobTitle: job.title,
      department: job.department,
      country: country.name,
      salary,
      currency: country.currency,
      employmentType,
      hireDate: isoDate,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  return {
    employees,
    totalCount: count,
    batchCount: Math.ceil(count / batchSize),
  };
};
