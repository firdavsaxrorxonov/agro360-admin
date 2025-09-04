"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Category } from "@/types/product"

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  editingCategory?: Category | null
  onSubmit: (categoryData: FormData) => Promise<void>
}

export function CategoryForm({
  isOpen,
  onClose,
  editingCategory,
  onSubmit,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    nameUz: "",
    nameRu: "",
    image: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        nameUz: editingCategory.nameUz || "",
        nameRu: editingCategory.nameRu || "",
        image: editingCategory.image || "",
      })
      setImageFile(null)
    } else {
      setFormData({ nameUz: "", nameRu: "", image: "" })
      setImageFile(null)
    }
  }, [editingCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nameUz || !formData.nameRu) return

    try {
      setLoading(true)
      const data = new FormData()
      data.append("name_uz", formData.nameUz)
      data.append("name_ru", formData.nameRu)

      // 🔹 image optional: agar tanlangan bo‘lsa append qilamiz
      if (imageFile) {
        data.append("image", imageFile)
      }

      await onSubmit(data)

      onClose()
      setFormData({ nameUz: "", nameRu: "", image: "" })
      setImageFile(null)
    } catch (error) {
      console.error("Kategoriya saqlashda xato:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setFormData({ ...formData, image: URL.createObjectURL(file) })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? "Update the category information below."
              : "Fill in the category information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nameUz">Category Name (Uzbek)</Label>
            <Input
              id="nameUz"
              value={formData.nameUz}
              onChange={(e) =>
                setFormData({ ...formData, nameUz: e.target.value })
              }
              placeholder="Enter category name in Uzbek"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameRu">Category Name (Russian)</Label>
            <Input
              id="nameRu"
              value={formData.nameRu}
              onChange={(e) =>
                setFormData({ ...formData, nameRu: e.target.value })
              }
              placeholder="Enter category name in Russian"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
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
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
