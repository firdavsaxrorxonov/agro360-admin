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
import { useLanguage } from "@/contexts/language-context" // <-- qo‘shildi

interface Unit {
  id: string
  name_uz: string
}

interface Supplier {
  id: string
  full_name: string
  tg_id: string
}

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  units: Unit[]
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
  const { t } = useLanguage() // <-- qo‘shildi

  const [formData, setFormData] = useState({
    name_uz: "",
    name_ru: "",
    price: "",
    category: "",
    unity: "",
    description_uz: "",
    description_ru: "",
    tg_id: "",
    code: "",
    article: "",
    imageFile: undefined as File | undefined,
  })

  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("agroAdminToken")
        const { data } = await axios.get('https://agro.felixits.uz/api/v1/orders/supplier/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSuppliers(data)
      } catch (err) {
        console.error(t("Failed to fetch suppliers") + ":", err) // <-- tarjima qo‘shildi
      }
    }
    fetchSuppliers()
  }, [t])

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name_uz: editingProduct.name_uz,
        name_ru: editingProduct.name_ru,
        price: editingProduct.price.toString(),
        category: editingProduct.category || (categories[0]?.id.toString() || ""),
        unity: editingProduct.unity || (units[0]?.id || ""),
        description_uz: editingProduct.description_uz || "",
        description_ru: editingProduct.description_ru || "",
        tg_id: editingProduct.tg_id || "",
        code: editingProduct.code || "",
        article: editingProduct.article || "",
        imageFile: undefined,
      })
    } else if (units.length > 0 && categories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        category: categories[0].id.toString(),
        unity: units[0].id,
      }))
    }
  }, [editingProduct, units, categories])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFormData({ ...formData, imageFile: file })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name_uz || !formData.name_ru || !formData.price || !formData.category || !formData.unity) {
      alert(t("Please fill all required fields"))
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
      alert(t("Error") + ": " + JSON.stringify(err.response?.data || err))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingProduct ? t("update") : t("create")}</DialogTitle>
          <DialogDescription>
            {editingProduct ? t("Update the product information below.") : t("Fill in the product information below.")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Name (UZ)")}</Label>
              <Input value={formData.name_uz} onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })} />
            </div>
            <div>
              <Label>{t("Name (RU)")}</Label>
              <Input value={formData.name_ru} onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Price")}</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("Category")}</Label>
              {categories.length > 0 ? (
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select category")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nameUz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-gray-500">{t("Loading categories...")}</div>
              )}
            </div>
          </div>

          <div>
            <Label>{t("Unit")}</Label>
            {units.length > 0 ? (
              <Select value={formData.unity} onValueChange={(value) => setFormData({ ...formData, unity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select unit")} />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name_uz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-gray-500">{t("Loading units...")}</div>
            )}
          </div>

          <div>
            <Label>{t("Telegram ID")}</Label>
            {suppliers.length > 0 ? (
              <Select value={formData.tg_id} onValueChange={(value) => setFormData({ ...formData, tg_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select Telegram ID")} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.tg_id}>
                      {s.full_name} ({s.tg_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-gray-500">{t("Loading suppliers...")}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Code")}</Label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </div>
            <div>
              <Label>{t("Article")}</Label>
              <Input value={formData.article} onChange={(e) => setFormData({ ...formData, article: e.target.value })} />
            </div>
          </div>

          <div>
            <Label>{t("Description (UZ)")}</Label>
            <Textarea
              value={formData.description_uz}
              onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
            />
          </div>
          <div>
            <Label>{t("Description (RU)")}</Label>
            <Textarea
              value={formData.description_ru}
              onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
            />
          </div>

          <div>
            <Label>{t("Image")}</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit">{editingProduct ? t("update") : t("create")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
