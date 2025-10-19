import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Load environment variables
config({ path: '.env.local' });
config(); // Also load .env

// Define users table schema inline
const users = pgTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    username: varchar("username", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    role: varchar("role", { length: 50 }).notNull().default("viewer"),
    address: text("address"),
    phoneNumber: varchar("phone_number", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

async function seedAdminSafe() {
    // Check if environment variables are set
    const adminEmail = process.env.SUPER_ADMIN_EMAIL;
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const databaseUrl = process.env.DATABASE_URL;

    // If not set, skip silently (optional for CI/CD)
    if (!adminEmail || !adminPassword) {
        console.log("⚠️  SUPER_ADMIN credentials not set. Skipping admin seed.");
        console.log("💡 This is normal for CI/CD builds without admin setup.");
        return;
    }

    if (!databaseUrl) {
        console.log("⚠️  DATABASE_URL not set. Skipping admin seed.");
        return;
    }

    try {
        const client = postgres(databaseUrl);
        const db = drizzle(client);

        console.log("🔍 Checking for existing admin user...");
        const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

        if (existingAdmin.length > 0) {
            console.log("✅ Admin user already exists. Updating password...");
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            await db.update(users).set({
                password: hashedPassword,
                updatedAt: new Date()
            }).where(eq(users.id, existingAdmin[0].id));
            console.log("✅ Admin password updated successfully!");
            await client.end();
            return;
        }

        console.log("📝 Creating new admin user...");
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        await db.insert(users).values({
            id: crypto.randomUUID(),
            username: "super_admin",
            email: adminEmail,
            password: hashedPassword,
            role: "super_admin",
            address: "Admin Address",
            phoneNumber: "+1234567890",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log("✅ Admin user created successfully!");
        console.log(`📧 Email: ${adminEmail}`);
        console.log("🔒 Password: [HIDDEN FOR SECURITY]");

        await client.end();
    } catch (error) {
        console.error("⚠️  Error in admin seed (non-critical):", error);
        // Don't fail the build
        process.exit(0);
    }
}

seedAdminSafe().catch((error) => {
    console.error("⚠️  Admin seed failed (non-critical):", error);
    process.exit(0); // Exit gracefully
});
