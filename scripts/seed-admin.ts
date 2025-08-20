import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

async function seedAdmin() {
  try {
    console.log("Creating admin user...")

    const hashedPassword = await bcrypt.hash("admin123", 12)

    await db.insert(users).values({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "super_admin",
      address: "Admin Address",
      phoneNumber: "+1234567890",
    })

    console.log("Admin user created successfully!")
    console.log("Email: admin@example.com")
    console.log("Password: admin123")
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

seedAdmin()
