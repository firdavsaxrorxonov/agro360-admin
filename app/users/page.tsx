"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { UserCard } from "@/components/users/user-card"
import { UserForm } from "@/components/users/user-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { User } from "@/types/order"

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    username: "john_doe",
    email: "john@example.com",
    role: "user",
    createdAt: "2024-01-05T14:20:00Z",
    lastLogin: "2024-01-14T09:15:00Z",
  },
  {
    id: 3,
    username: "jane_smith",
    email: "jane@example.com",
    role: "moderator",
    createdAt: "2024-01-08T11:45:00Z",
    lastLogin: "2024-01-13T16:22:00Z",
  },
  {
    id: 4,
    username: "mike_johnson",
    email: "mike@example.com",
    role: "user",
    createdAt: "2024-01-10T09:30:00Z",
  },
  {
    id: 5,
    username: "sarah_wilson",
    email: "sarah@example.com",
    role: "user",
    createdAt: "2024-01-12T15:10:00Z",
    lastLogin: "2024-01-12T15:45:00Z",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const filteredUsers = roleFilter === "all" ? users : users.filter((user) => user.role === roleFilter)

  const handleCreateUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map((u) => u.id)) + 1,
      createdAt: new Date().toISOString(),
    }
    setUsers((prev) => [newUser, ...prev])
  }

  const handleUpdateUser = (userData: Omit<User, "id" | "createdAt">) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...userData, id: editingUser.id, createdAt: editingUser.createdAt } : user,
        ),
      )
      setEditingUser(null)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingUser(null)
  }

  // Calculate user statistics
  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    moderators: users.filter((u) => u.role === "moderator").length,
    users: users.filter((u) => u.role === "user").length,
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Users</h1>
              <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* User Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{userStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{userStats.admins}</div>
              <div className="text-sm text-muted-foreground">Administrators</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{userStats.moderators}</div>
              <div className="text-sm text-muted-foreground">Moderators</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{userStats.users}</div>
              <div className="text-sm text-muted-foreground">Regular Users</div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <label htmlFor="role-filter" className="text-sm font-medium">
              Filter by Role:
            </label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No users found. {roleFilter !== "all" ? "Try changing the filter or " : ""}Create your first user to get
                started.
              </p>
            </div>
          )}

          {/* User Form Modal */}
          <UserForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            editingUser={editingUser}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
