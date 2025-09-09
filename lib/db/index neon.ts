// src/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import postgres from "postgres"
import * as schema from "./schema";

config({ path: ".env.local" }); // or .env.local

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });



let cachedDb: ReturnType<typeof drizzle> | null = null

export async function getDb() {
    if (cachedDb) return cachedDb

    const client = postgres(process.env.DATABASE_URL!, { ssl: "require" })
    cachedDb = drizzle( client as any)
    return cachedDb
}


// write this in terminal if you edit in schema // ==>

// npx drizzle-kit generate
// npx drizzle-kit push
// npx drizzle-kit migrate



// import { drizzle } from "drizzle-orm/node-postgres";
// import pg from "pg";
// import * as schema from "./schema";

// const pool = new pg.Pool({
//     connectionString: process.env.DATABASE_URL,
// });

// export const db = drizzle(pool, { schema });

// export async function isDatabaseAvailable() {
//     try {
//         await import("@/lib/db")
//         await import("@/lib/db/schema")
//         return true
//     } catch (error) {
//         console.warn("Database not available, using mock service")
//         return false
//     }
// }


