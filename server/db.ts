import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Pool and db are constructed lazily so that modules importing them at the
// top level (e.g. server/pgStorage.ts, server/routes.ts) don't crash in
// environments where DATABASE_URL is not set (e.g. local JSON-file mode).
// Any actual query will fail clearly at call time if DATABASE_URL is missing.
let _pool: pg.Pool | null = null;
function getPool(): pg.Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set to use the database. " +
          "Set it in your environment or remove the database-backed code path.",
      );
    }
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

export const pool = new Proxy({} as pg.Pool, {
  get(_t, prop) {
    const p = getPool() as any;
    const value = p[prop];
    return typeof value === "function" ? value.bind(p) : value;
  },
});

export const db = drizzle(pool, { schema });
