export async function DatabaseConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not set - using demo mode")
      return false
    }

    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL)

    // Test simple query
    await sql`SELECT 1`
    console.log("Database connection successful")
    return true
  } catch (error) {
    console.log("Database connection failed:", error)
    console.log("Falling back to demo mode")
    return false
  }
}
