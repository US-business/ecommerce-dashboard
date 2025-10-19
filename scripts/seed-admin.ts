import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Load environment variables from .env.local
config({ path: '.env.local' });

// Define users table schema inline to avoid server-only imports
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

// Create database connection
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function seedAdmin() {
  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env.local");
    return;
  }

  try {
    console.log("Checking for existing admin user...");
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

    if (existingAdmin.length > 0) {
        console.log("✅ Admin user with this email already exists. Updating password...");
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await db.update(users).set({ 
          password: hashedPassword,
          updatedAt: new Date()
        }).where(eq(users.id, existingAdmin[0].id));
        console.log("\n✅ Admin password updated successfully!");
        console.log(`📧 Email: ${adminEmail}`);
        console.log("🔒 Password: [HIDDEN FOR SECURITY]");
        console.log("\n🎉 You can now login with these credentials!\n");
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

    console.log("\n✅ Admin user created successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log("🔒 Password: [HIDDEN FOR SECURITY]");
    console.log("\n🎉 You can now login at: http://localhost:3000/ar/signin\n");
    
    await client.end();
  } catch (error) {
    console.error("\n❌ Error creating admin user:", error);
    await client.end();
    process.exit(1);
  }
}

seedAdmin().catch(console.error);
