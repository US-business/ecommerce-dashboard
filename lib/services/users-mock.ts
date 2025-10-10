// Mock users service for demo mode
export interface User {
  id: number
  username: string
  email: string
  password: string
  address?: string
  phoneNumber?: string
  role: "super_admin" | "viewer"
  createdAt: Date
}

// Mock data (including the demo users)
const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    address: "123 Admin Street",
    phoneNumber: "+1234567890",
    role: "super_admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    username: "viewer",
    email: "viewer@example.com",
    password: "viewer123",
    address: "456 Viewer Avenue",
    phoneNumber: "+0987654321",
    role: "viewer",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: 3,
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
    address: "789 User Lane",
    phoneNumber: "+1122334455",
    role: "viewer",
    createdAt: new Date("2024-01-03"),
  },
  {
    id: 4,
    username: "sarah_admin",
    email: "sarah@example.com",
    password: "admin456",
    address: "321 Manager Blvd",
    phoneNumber: "+5566778899",
    role: "super_admin",
    createdAt: new Date("2024-01-04"),
  },
]

let nextId = 5

export const mockUsersService = {
  async getUsers(page = 1, limit = 10, search?: string) {
    let filteredUsers = mockUsers

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = mockUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.address?.toLowerCase().includes(searchLower) ||
          user.phoneNumber?.includes(search),
      )
    }

    const offset = (page - 1) * limit
    const paginatedUsers = filteredUsers.slice(offset, offset + limit)

    // Remove password from response
    const safeUsers = paginatedUsers.map(({ password, ...user }) => user)

    return {
      success: true,
      data: safeUsers,
      total: filteredUsers.length,
    }
  },

  async getUser(id: number) {
    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Remove password from response
    const { password, ...safeUser } = user

    return {
      success: true,
      data: safeUser,
    }
  },

  async createUser(data: any) {
    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email === data.email)
    if (existingUser) {
      return {
        success: false,
        error: "Email already exists",
      }
    }

    // Check if username already exists
    const existingUsername = mockUsers.find((u) => u.username === data.username)
    if (existingUsername) {
      return {
        success: false,
        error: "Username already exists",
      }
    }

    const newUser: User = {
      id: nextId++,
      username: data.username,
      email: data.email,
      password: data.password, // In production, this should be hashed
      address: data.address,
      phoneNumber: data.phoneNumber,
      role: data.role,
      createdAt: new Date(),
    }

    mockUsers.unshift(newUser)

    // Remove password from response
    const { password, ...safeUser } = newUser

    return {
      success: true,
      data: safeUser,
    }
  },

  async updateUser(id: number, data: any) {
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Check if email already exists (excluding current user)
    const existingUser = mockUsers.find((u) => u.email === data.email && u.id !== id)
    if (existingUser) {
      return {
        success: false,
        error: "Email already exists",
      }
    }

    // Check if username already exists (excluding current user)
    const existingUsername = mockUsers.find((u) => u.username === data.username && u.id !== id)
    if (existingUsername) {
      return {
        success: false,
        error: "Username already exists",
      }
    }

    const updatedUser: User = {
      ...mockUsers[index],
      username: data.username,
      email: data.email,
      address: data.address,
      phoneNumber: data.phoneNumber,
      role: data.role,
      // Only update password if provided
      ...(data.password && { password: data.password }),
    }

    mockUsers[index] = updatedUser

    // Remove password from response
    const { password, ...safeUser } = updatedUser

    return {
      success: true,
      data: safeUser,
    }
  },

  async deleteUser(id: number) {
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Prevent deleting the main admin user
    if (mockUsers[index].email === "admin@example.com") {
      return {
        success: false,
        error: "Cannot delete the main admin user",
      }
    }

    mockUsers.splice(index, 1)

    return {
      success: true,
    }
  },
}
