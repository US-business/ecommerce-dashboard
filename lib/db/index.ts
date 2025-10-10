import { drizzle } from "drizzle-orm/postgres-js";
import * as dotenv from "dotenv";
import postgres from "postgres";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set");
}

const connectionString = process.env.DATABASE_URL;

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
