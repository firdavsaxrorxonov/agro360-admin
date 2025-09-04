"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import axios from "axios"
import type { Category } from "@/types/product"

interface Unit {
  id: string
  name_uz: string
}

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  units: Unit[]             // ✅ parentdan keladi
  editingProduct?: {
    id: string
    name_uz: string
    name_ru: string
    price: number
    category: string
    unity: string
    description_uz?: string
    description_ru?: string
    tg_id?: string
    code?: string
    article?: string
  } | null
  onSuccess?: () => void
}

export function ProductForm({ isOpen, onClose, categories, units, editingProduct, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name_uz: "",
    name_ru: "",
    price: "",
    category: categories[0]?.id.toString() || "",
    unity: units[0]?.id || "",    // ✅ default value
    description_uz: "",
    description_ru: "",
    tg_id: "",
    code: "",
    article: "",
    imageFile: undefined as File | undefined,
  })

  // 🔥 editingProduct yoki units o'zgarganda formData-ni yangilash
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name_uz: editingProduct.name_uz,
        name_ru: editingProduct.name_ru,
        price: editingProduct.price.toString(),
        category: editingProduct.category,
        unity: editingProduct.unity || units[0]?.id || "",  // ✅ fallback
        description_uz: editingProduct.description_uz || "",
        description_ru: editingProduct.description_ru || "",
        tg_id: editingProduct.tg_id || "",
        code: editingProduct.code || "",
        article: editingProduct.article || "",
        imageFile: undefined,
      })
    } else {
      setFormData({
        name_uz: "",
        name_ru: "",
        price: "",
        category: categories[0]?.id.toString() || "",
        unity: units[0]?.id || "",    // ✅ default value
        description_uz: "",
        description_ru: "",
        tg_id: "",
        code: "",
        article: "",
        imageFile: undefined,
      })
    }
  }, [editingProduct, categories, units])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFormData({ ...formData, imageFile: file })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name_uz || !formData.name_ru || !formData.price || !formData.category || !formData.unity) {
      alert("Please fill all required fields")
      return
    }

    const fd = new FormData()
    fd.append("name_uz", formData.name_uz)
    fd.append("name_ru", formData.name_ru)
    fd.append("price", formData.price.toString())
    fd.append("category", formData.category)
    fd.append("unity", formData.unity)
    fd.append("description_uz", formData.description_uz)
    fd.append("description_ru", formData.description_ru)
    fd.append("tg_id", formData.tg_id)
    fd.append("code", formData.code)
    fd.append("article", formData.article)
    if (formData.imageFile) fd.append("image", formData.imageFile)

    try {
      const token = localStorage.getItem("agroAdminToken")
      const url = editingProduct
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${editingProduct.id}/update/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/create/`

      await axios({
        method: editingProduct ? "PATCH" : "POST",
        url,
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      onSuccess?.()
      onClose()
    } catch (err: any) {
      console.error(err.response?.data || err)
      alert("Error: " + JSON.stringify(err.response?.data || err))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
          <DialogDescription>
            {editingProduct ? "Update the product information below." : "Fill in the product information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name (UZ)</Label>
              <Input value={formData.name_uz} onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })} />
            </div>
            <div>
              <Label>Name (RU)</Label>
              <Input value={formData.name_ru} onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })} />
            </div>
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price</Label>
              <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nameUz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Unit */}
          <div>
            <Label>Unit</Label>
            <Select value={formData.unity} onValueChange={(value) => setFormData({ ...formData, unity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name_uz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tg ID & Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tg ID</Label>
              <Input value={formData.tg_id} onChange={(e) => setFormData({ ...formData, tg_id: e.target.value })} />
            </div>
            <div>
              <Label>Code</Label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </div>
          </div>

          {/* Article */}
          <div>
            <Label>Article</Label>
            <Input value={formData.article} onChange={(e) => setFormData({ ...formData, article: e.target.value })} />
          </div>

          {/* Description */}
          <div>
            <Label>Description (UZ)</Label>
            <Textarea value={formData.description_uz} onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })} />
          </div>
          <div>
            <Label>Description (RU)</Label>
            <Textarea value={formData.description_ru} onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })} />
          </div>

          {/* Image */}
          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editingProduct ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
