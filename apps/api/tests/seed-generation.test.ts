/* eslint-disable no-unused-vars */

type SeedEmployee = {
  fullName: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: string;
  hireDate: string;
};

type SeedGenerationResult = {
  employees: SeedEmployee[];
  totalCount: number;
  batchCount: number;
};

interface GenerateEmployeeSeedData {
  (firstNames: string[], lastNames: string[], count: number, batchSize: number): SeedGenerationResult;
}

const loadSeedGenerator = (): GenerateEmployeeSeedData => {
  const moduleExports = require('../src/seed/generateEmployeeSeedData') as {
    generateEmployeeSeedData: GenerateEmployeeSeedData;
  };

  return moduleExports.generateEmployeeSeedData;
};

describe('employee seed generation', () => {
  it('generates deterministic employees in batches', () => {
    const generateEmployeeSeedData = loadSeedGenerator();

    const firstRun = generateEmployeeSeedData(
      ['Ava', 'Liam', 'Noah'],
      ['Patel', 'Kim', 'Garcia'],
      10,
      4,
    );
    const secondRun = generateEmployeeSeedData(
      ['Ava', 'Liam', 'Noah'],
      ['Patel', 'Kim', 'Garcia'],
      10,
      4,
    );

    expect(firstRun).toEqual(secondRun);
    expect(firstRun.totalCount).toBe(10);
    expect(firstRun.batchCount).toBe(3);
    expect(firstRun.employees[0]).toMatchObject({
      fullName: expect.any(String),
      salary: expect.any(Number),
      country: expect.any(String),
      jobTitle: expect.any(String),
    });
  });
});
