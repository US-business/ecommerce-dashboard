import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

async function setupDemoUsers() {
  try {
    console.log("Creating demo users...")

    // Create Super Admin
    await db.insert(users).values({
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // In production, this should be hashed
      role: "super_admin",
      address: "123 Admin Street",
      phoneNumber: "+1234567890",
    })

    // Create Viewer
    await db.insert(users).values({
      username: "viewer",
      email: "viewer@example.com",
      password: "viewer123", // In production, this should be hashed
      role: "viewer",
      address: "456 Viewer Avenue",
      phoneNumber: "+0987654321",
    })

    console.log("Demo users created successfully!")
    console.log("Super Admin - Email: admin@example.com, Password: admin123")
    console.log("Viewer - Email: viewer@example.com, Password: viewer123")
  } catch (error) {
    console.error("Error creating demo users:", error)
    console.log("Note: Make sure DATABASE_URL is set and database schema is created")
    console.log("You can still use the demo credentials:")
    console.log("Super Admin - Email: admin@example.com, Password: admin123")
    console.log("Viewer - Email: viewer@example.com, Password: viewer123")
  }
}

setupDemoUsers()
