"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit } from "lucide-react"
import type { Product, Category } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface ProductTableProps {
  products: Product[]
  onEditProduct: (product: Product) => void
  onDeleteProduct: (id: string) => void
  onUpdateProduct: (product: Product) => void
  currentPage: number
  itemsPerPage: number
  units: { id: string; name_uz: string; name_ru: string }[]
  categories: Category[]
}

export function ProductTable({
  products,
  onEditProduct,
  onDeleteProduct,
  onUpdateProduct,
  currentPage,
  itemsPerPage,
  units,
  categories,
}: ProductTableProps) {
  const { language, t } = useLanguage()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<string>("")

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getUnitName = (unityId: string) =>
    units.find((u) => u.id === unityId)
      ? language === "uz"
        ? units.find((u) => u.id === unityId)!.name_uz
        : units.find((u) => u.id === unityId)!.name_ru
      : "—"

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)
      ? language === "uz"
        ? categories.find((c) => c.id === categoryId)!.nameUz
        : categories.find((c) => c.id === categoryId)!.nameRu
      : "—"

  const handleDoubleClick = (product: Product) => {
    setEditingId(product.id)
    setTempPrice(product.price.toString())
  }

  const handlePriceUpdate = async (product: Product) => {
    if (tempPrice.trim() === "" || isNaN(Number(tempPrice))) return
    try {
      const token = localStorage.getItem("agroAdminToken")
      const fd = new FormData()
      fd.append("name_uz", product.name_uz)
      fd.append("name_ru", product.name_ru)
      fd.append("price", tempPrice)
      fd.append("category", product.category)
      fd.append("unity", product.unity)
      fd.append("tg_id", product.tg_id || "")
      fd.append("code", product.code || "")
      fd.append("article", product.article || "")
      fd.append("quantity_left", product.quantity_left?.toString() || "")
      fd.append("is_active", product.is_active ? "true" : "false")

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${product.id}/update/`, {
        method: "PATCH",
        body: fd,
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      })
      onUpdateProduct({ ...product, price: tempPrice })
      setEditingId(null)
    } catch (err) {
      console.error(err)
      alert(t("Error") + ": " + t("Failed to update product"))
    }
  }

  const handleToggleActive = async (product: Product, value: boolean) => {
    try {
      const token = localStorage.getItem("agroAdminToken")
      const fd = new FormData()
      fd.append("name_uz", product.name_uz)
      fd.append("name_ru", product.name_ru)
      fd.append("price", product.price.toString())
      fd.append("category", product.category)
      fd.append("unity", product.unity)
      fd.append("tg_id", product.tg_id || "")
      fd.append("code", product.code || "")
      fd.append("article", product.article || "")
      fd.append("quantity_left", product.quantity_left?.toString() || "")
      fd.append("is_active", value ? "true" : "false")

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${product.id}/update/`, {
        method: "PATCH",
        body: fd,
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      })
      // onUpdateProduct bilan state yangilanadi
      onUpdateProduct({ ...product, is_active: value })
    } catch (err) {
      console.error(err)
      alert(t("Error") + ": " + t("Failed to update product"))
    }
  }

  const confirmDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirmed = () => {
    if (deleteId) onDeleteProduct(deleteId)
    setDeleteId(null)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>{t("Name")}</TableHead>
              <TableHead>{t("Image")}</TableHead>
              <TableHead>{t("Price")}</TableHead>
              <TableHead>{t("Category")}</TableHead>
              <TableHead>{t("Unit")}</TableHead>
              <TableHead>{t("Telegram ID")}</TableHead>
              <TableHead>{t("Code")}</TableHead>
              <TableHead>{t("Article")}</TableHead>
              <TableHead>{t("quantity_Left")}</TableHead>
              <TableHead>{t("min_quantity")}</TableHead>
              <TableHead>{t("Active")}</TableHead>
              <TableHead>{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{language === "uz" ? product.name_uz : product.name_ru}</TableCell>
                <TableCell>
                  {product.image ? (
                    <div className="flex flex-col mr-2.5 items-start gap-1">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_ImgBASE_URL}${product.image}`}
                        alt={product.name_uz}
                        className="w-25 h-15 object-cover rounded"
                      />
                    </div>
                  ) : "—"}
                </TableCell>
                <TableCell
                  onDoubleClick={() => handleDoubleClick(product)}
                  className="cursor-pointer"
                >
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      onBlur={() => handlePriceUpdate(product)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handlePriceUpdate(product)
                        if (e.key === "Escape") setEditingId(null)
                      }}
                      autoFocus
                      className="w-20 border rounded px-1"
                    />
                  ) : (
                    product.price
                  )}{" "}UZS
                </TableCell>
                <TableCell>{getCategoryName(product.category)}</TableCell>
                <TableCell>{getUnitName(product.unity)}</TableCell>
                <TableCell>{product.tg_id && product.tg_id !== "none" ? product.tg_id : "—"}</TableCell>
                <TableCell>{product.code || "—"}</TableCell>
                <TableCell>{product.article || "—"}</TableCell>
                <TableCell>{product.quantity_left || "—"}</TableCell>
                <TableCell>{product.min_quantity || "—"}</TableCell>

                {/* 🔹 is_active toggle avtomatik on/off */}
                <TableCell>
                  <Switch
                    checked={!!product.is_active}
                    onCheckedChange={(val) => handleToggleActive(product, val)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                </TableCell>


                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirmDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("ConDel")}</DialogTitle>
            <DialogDescription>{t("sure")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t("Cancele")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              {t("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
