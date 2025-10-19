import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/lib/config/env";

// Use validated environment variable
const connectionString = env.DATABASE_URL;

const client = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  prepare: false,
});

export const db = drizzle(client, { schema });

let cachedDb: ReturnType<typeof drizzle> | null = null;
export async function getDb() {
  if (cachedDb) return cachedDb;
  const client = postgres(connectionString, {
    ssl: { rejectUnauthorized: false },
    prepare: false,
  });
  cachedDb = drizzle(client, { schema });
  return cachedDb;
}
