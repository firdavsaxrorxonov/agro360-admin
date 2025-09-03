"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Product, Category } from "@/types/product"

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (product: Omit<Product, "id" | "createdAt">) => void
  categories: Category[]
  editingProduct?: Product | null
}

export function ProductForm({ isOpen, onClose, onSubmit, categories, editingProduct }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nameUz: editingProduct?.nameUz || "",
    nameRu: editingProduct?.nameRu || "",
    price: editingProduct?.price?.toString() || "",
    category: editingProduct?.category || "",
    description: editingProduct?.description || "",
    unit: editingProduct?.unit || ("piece" as const),
    image: editingProduct?.image || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nameUz || !formData.nameRu || !formData.price || !formData.category) {
      return
    }

    onSubmit({
      nameUz: formData.nameUz,
      nameRu: formData.nameRu,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      unit: formData.unit,
      image: formData.image,
    })

    // Reset form
    setFormData({
      nameUz: "",
      nameRu: "",
      price: "",
      category: "",
      description: "",
      unit: "piece",
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
          <DialogDescription>
            {editingProduct ? "Update the product information below." : "Fill in the product information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameUz">Product Name (Uzbek)</Label>
              <Input
                id="nameUz"
                value={formData.nameUz}
                onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameRu">Product Name (Russian)</Label>
              <Input
                id="nameRu"
                value={formData.nameRu}
                onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value: "piece" | "kg") => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piece">Per Piece</SelectItem>
                  <SelectItem value="kg">Per Kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.nameUz}>
                      {category.nameUz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
