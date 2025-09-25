"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { User } from "@/types/order"
import { useLanguage } from "@/contexts/language-context"

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: Omit<User, "id" | "date_joined" | "last_login"> & { role: string; password?: string; is_superuser: boolean }) => void
  editingUser?: User | null
}

export function UserForm({ isOpen, onClose, onSubmit, editingUser }: UserFormProps) {
  const { t } = useLanguage()

  const initialRole = editingUser?.role || "user"
  const initialIsSuperuser = initialRole === "admin"

  const [formData, setFormData] = useState({
    username: editingUser?.username || "",
    password: "",
    role: initialRole,
    is_superuser: initialIsSuperuser,
  })

  useEffect(() => {
    const role = editingUser?.role || "user"
    setFormData({
      username: editingUser?.username || "",
      password: "",
      role: role,
      is_superuser: role === "admin",
    })
  }, [editingUser])

  const handleRoleChange = (val: string) => {
    setFormData({
      ...formData,
      role: val,
      is_superuser: val === "admin",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || (!editingUser && !formData.password)) {
      alert(t("Please fill all required fields"))
      return
    }
    onSubmit(formData)
    setFormData({ username: "", password: "", role: "user", is_superuser: false })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingUser ? t("Edit User") : t("Create User")}</DialogTitle>
          <DialogDescription>{t("Fill in the user details")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>{t("Username")}</Label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          {!editingUser && (
            <div className="space-y-2">
              <Label>{t("Password")}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{t("Role")}</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t("User")}</SelectItem>
                <SelectItem value="admin">{t("Admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button type="submit">{editingUser ? t("Update") : t("Create")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
