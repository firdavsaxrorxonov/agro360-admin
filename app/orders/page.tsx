"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { OrderTable } from "@/components/orders/order-table"
import { OrderDetails } from "@/components/orders/order-details"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order } from "@/types/order"

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    amount: 299.99,
    status: "delivered",
    itemCount: 3,
    items: [
      { productId: 1, productName: "Wireless Headphones", quantity: 1, price: 199.99 },
      { productId: 2, productName: "Phone Case", quantity: 2, price: 50.0 },
    ],
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    amount: 149.5,
    status: "processing",
    itemCount: 2,
    items: [
      { productId: 3, productName: "Bluetooth Speaker", quantity: 1, price: 99.99 },
      { productId: 4, productName: "USB Cable", quantity: 1, price: 49.51 },
    ],
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    amount: 89.99,
    status: "shipped",
    itemCount: 1,
    items: [{ productId: 5, productName: "Wireless Mouse", quantity: 1, price: 89.99 }],
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "ORD-004",
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    amount: 459.97,
    status: "pending",
    itemCount: 4,
    items: [
      { productId: 6, productName: "Laptop Stand", quantity: 1, price: 199.99 },
      { productId: 7, productName: "Keyboard", quantity: 1, price: 129.99 },
      { productId: 8, productName: "Mouse Pad", quantity: 2, price: 64.99 },
    ],
    createdAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "ORD-005",
    customerName: "David Brown",
    customerEmail: "david@example.com",
    amount: 199.99,
    status: "cancelled",
    itemCount: 1,
    items: [{ productId: 9, productName: "Gaming Headset", quantity: 1, price: 199.99 }],
    createdAt: "2024-01-11T11:30:00Z",
  },
]

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  // Calculate product order statistics
  const productStats = orders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        if (!acc[item.productName]) {
          acc[item.productName] = { count: 0, totalQuantity: 0 }
        }
        acc[item.productName].count += 1
        acc[item.productName].totalQuantity += item.quantity
      })
      return acc
    },
    {} as Record<string, { count: number; totalQuantity: number }>,
  )

  const topProducts = Object.entries(productStats)
    .sort(([, a], [, b]) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5)

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">View and manage customer orders</p>
          </div>

          {/* Order Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">
                ${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{orders.reduce((sum, order) => sum + order.itemCount, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{orders.filter((order) => order.status === "pending").length}</div>
              <div className="text-sm text-muted-foreground">Pending Orders</div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Most Ordered Products</h3>
            <div className="space-y-2">
              {topProducts.map(([productName, stats]) => (
                <div key={productName} className="flex justify-between items-center">
                  <span className="text-sm">{productName}</span>
                  <div className="text-sm text-muted-foreground">
                    {stats.totalQuantity} units ({stats.count} orders)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <label htmlFor="status-filter" className="text-sm font-medium">
              Filter by Status:
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <OrderTable orders={filteredOrders} onViewOrder={handleViewOrder} />

          {/* Order Details Modal */}
          <OrderDetails isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} order={selectedOrder} />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
