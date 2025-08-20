export interface OrderItem {
  id: string
  productId: string
  productName: string
  productNameAr: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: Date
  updatedAt: Date
  notes?: string
}

export class OrdersMockService {
  private static orders: Order[] = [
    {
      id: "ORD-001",
      customerName: "Ahmed Hassan",
      customerEmail: "ahmed@example.com",
      customerPhone: "+1234567890",
      shippingAddress: "123 Main St, Cairo, Egypt",
      items: [
        {
          id: "item-1",
          productId: "1",
          productName: "Wireless Headphones",
          productNameAr: "سماعات لاسلكية",
          quantity: 2,
          price: 99.99,
          total: 199.98,
        },
        {
          id: "item-2",
          productId: "2",
          productName: "Smart Watch",
          productNameAr: "ساعة ذكية",
          quantity: 1,
          price: 299.99,
          total: 299.99,
        },
      ],
      total: 499.97,
      status: "processing",
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      notes: "Customer requested express delivery",
    },
    {
      id: "ORD-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      customerPhone: "+1987654321",
      shippingAddress: "456 Oak Ave, New York, USA",
      items: [
        {
          id: "item-3",
          productId: "3",
          productName: "Laptop Stand",
          productNameAr: "حامل لابتوب",
          quantity: 1,
          price: 49.99,
          total: 49.99,
        },
      ],
      total: 49.99,
      status: "shipped",
      paymentMethod: "PayPal",
      paymentStatus: "paid",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "ORD-003",
      customerName: "Mohammed Ali",
      customerEmail: "mohammed@example.com",
      customerPhone: "+1122334455",
      shippingAddress: "789 Pine St, Dubai, UAE",
      items: [
        {
          id: "item-4",
          productId: "4",
          productName: "Gaming Mouse",
          productNameAr: "فأرة ألعاب",
          quantity: 3,
          price: 79.99,
          total: 239.97,
        },
      ],
      total: 239.97,
      status: "delivered",
      paymentMethod: "Bank Transfer",
      paymentStatus: "paid",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-18"),
    },
    {
      id: "ORD-004",
      customerName: "Emily Chen",
      customerEmail: "emily@example.com",
      customerPhone: "+1555666777",
      shippingAddress: "321 Elm St, Toronto, Canada",
      items: [
        {
          id: "item-5",
          productId: "5",
          productName: "Bluetooth Speaker",
          productNameAr: "مكبر صوت بلوتوث",
          quantity: 1,
          price: 129.99,
          total: 129.99,
        },
      ],
      total: 129.99,
      status: "pending",
      paymentMethod: "Credit Card",
      paymentStatus: "pending",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: "ORD-005",
      customerName: "John Smith",
      customerEmail: "john.smith@example.com",
      customerPhone: "+1999888777",
      shippingAddress: "555 Broadway, Los Angeles, USA",
      items: [
        {
          id: "item-6",
          productId: "6",
          productName: "Wireless Keyboard",
          productNameAr: "لوحة مفاتيح لاسلكية",
          quantity: 2,
          price: 89.99,
          total: 179.98,
        },
      ],
      total: 179.98,
      status: "cancelled",
      paymentMethod: "Credit Card",
      paymentStatus: "failed",
      createdAt: new Date("2024-01-12"),
      updatedAt: new Date("2024-01-12"),
    },
  ]

  static async getAll(): Promise<Order[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [...this.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static async getById(id: string): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const order = this.orders.find((order) => order.id === id)
    console.log(`Looking for order ${id}, found:`, order)
    return order || null
  }

  static async search(query: string): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (!query || query.trim() === "") {
      return this.getAll()
    }

    const searchTerm = query.toLowerCase().trim()

    return this.orders
      .filter((order) => {
        // Search in order ID
        if (order.id.toLowerCase().includes(searchTerm)) {
          return true
        }

        // Search in customer name
        if (order.customerName.toLowerCase().includes(searchTerm)) {
          return true
        }

        // Search in customer email
        if (order.customerEmail.toLowerCase().includes(searchTerm)) {
          return true
        }

        // Search in status
        if (order.status.toLowerCase().includes(searchTerm)) {
          return true
        }

        // Search in payment method
        if (order.paymentMethod.toLowerCase().includes(searchTerm)) {
          return true
        }

        // Search in product names
        const hasMatchingProduct = order.items.some(
          (item) => item.productName.toLowerCase().includes(searchTerm) || item.productNameAr.includes(searchTerm),
        )

        if (hasMatchingProduct) {
          return true
        }

        return false
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static async updateStatus(id: string, status: Order["status"]): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const orderIndex = this.orders.findIndex((order) => order.id === id)
    if (orderIndex === -1) return null

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status,
      updatedAt: new Date(),
    }
    return this.orders[orderIndex]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const orderIndex = this.orders.findIndex((order) => order.id === id)
    if (orderIndex === -1) return false

    this.orders.splice(orderIndex, 1)
    return true
  }

  static getStatusColor(status: Order["status"]): string {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status] || colors.pending
  }
}
