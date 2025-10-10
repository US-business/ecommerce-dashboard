
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { config } from "dotenv";
import { eq } from "drizzle-orm";

// Load environment variables from .env.local
config({ path: '.env.local' });

async function seedAdmin() {
  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env.local");
    return;
  }

  try {
    console.log("Checking for existing admin user...");
    const existingAdmin = await db.query.users.findFirst({
        where: eq(users.email, adminEmail),
    });

    if (existingAdmin) {
        console.log("Admin user with this email already exists. Updating password...");
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await db.update(users).set({ password: hashedPassword }).where(eq(users.id, existingAdmin.id));
        console.log("Admin password updated successfully!");
        console.log(`Email: ${adminEmail}`);
        console.log("Password: [HIDDEN FOR SECURITY]");
        return;
    }

    console.log("Creating new admin user...");
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await db.insert(users).values({
      username: "super_admin", // or derive from email
      email: adminEmail,
      password: hashedPassword,
      role: "super_admin",
      address: "Admin Address",
      phoneNumber: "+1234567890",
    });

    console.log("Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log("Password: [HIDDEN FOR SECURITY]");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

seedAdmin();
