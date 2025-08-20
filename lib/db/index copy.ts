// src/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: ".env.local" }); // or .env.local

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });


// write this in terminal if you edit in schema // ==>

// npx drizzle-kit generate
// npx drizzle-kit push
// npx drizzle-kit migrate



