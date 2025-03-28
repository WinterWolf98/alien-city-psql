import PG from 'pg';
// import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const { Pool } = PG;

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// export default new PrismaClient({ adapter });
export default new PrismaClient();