const os = require('node:os');
const path = require('node:path');

const testDatabasePath = path.join(os.tmpdir(), 'salary-management-api-test.db');
process.env.DATABASE_URL = `file:${testDatabasePath.replace(/\\/g, '/')}`;

const { ensureDatabaseSchema } = require('./src/lib/database');
const { prisma } = require('./src/lib/prisma');

beforeAll(async () => {
  await ensureDatabaseSchema();
});

afterEach(async () => {
  await prisma.employee.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
