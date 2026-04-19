import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Pool construction is non-throwing even when DATABASE_URL is undefined
// (pg falls back to standard libpq env defaults and only errors at query
// time). This lets modules import `db`/`pool` safely in JSON-fallback mode
// where the database code path is never actually exercised.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
