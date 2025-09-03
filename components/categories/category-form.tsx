"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Category } from "@/types/product"

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (category: Omit<Category, "id">) => void
  editingCategory?: Category | null
}

export function CategoryForm({ isOpen, onClose, onSubmit, editingCategory }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    nameUz: editingCategory?.nameUz || "",
    nameRu: editingCategory?.nameRu || "",
    image: editingCategory?.image || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nameUz || !formData.nameRu) {
      return
    }

    onSubmit({
      nameUz: formData.nameUz,
      nameRu: formData.nameRu,
      image: formData.image,
    })

    // Reset form
    setFormData({
      nameUz: "",
      nameRu: "",
      image: "",
    })
    onClose()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server
      const imageUrl = URL.createObjectURL(file)
      setFormData({ ...formData, image: imageUrl })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
          <DialogDescription>
            {editingCategory ? "Update the category information below." : "Fill in the category information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nameUz">Category Name (Uzbek)</Label>
            <Input
              id="nameUz"
              value={formData.nameUz}
              onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
              placeholder="Enter category name in Uzbek"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameRu">Category Name (Russian)</Label>
            <Input
              id="nameRu"
              value={formData.nameRu}
              onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
              placeholder="Enter category name in Russian"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
