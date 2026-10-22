import { Pool, PoolConfig } from "pg";

let pool: Pool | null = null;

function getPoolConfig(): PoolConfig {
  return {
    host: process.env.PG_HOST ?? "localhost",
    port: Number(process.env.PG_PORT ?? 5432),
    user: process.env.PG_USER ?? "postgres",
    password: process.env.PG_PASSWORD ?? "postgres",
    database: process.env.PG_DATABASE ?? "todoservice",
    max: Number(process.env.PG_POOL_MAX ?? 10)
  };
}

function getPostgresPool(): Pool {
  if (!pool) {
    pool = new Pool(getPoolConfig());
  }

  return pool;
}

async function closePostgresPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

const PostgresPool = getPostgresPool();
export { closePostgresPool, PostgresPool };