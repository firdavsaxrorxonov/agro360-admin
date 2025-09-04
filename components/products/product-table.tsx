"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit } from "lucide-react"
import type { Product, Category } from "@/types/product"

interface ProductTableProps {
  products: Product[]
  onEditProduct: (product: Product) => void
  onDeleteProduct: (id: string) => void
  currentPage: number
  itemsPerPage: number
  units: { id: string; name_uz: string; name_ru: string }[]
  categories: Category[]
}

export function ProductTable({
  products,
  onEditProduct,
  onDeleteProduct,
  currentPage,
  itemsPerPage,
  units,
  categories,
}: ProductTableProps) {
  const getUnitName = (unityId: string) =>
    units.find((u) => u.id === unityId)?.name_uz || "—"

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.nameUz || "—"

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>Name (UZ)</TableHead>
              <TableHead>Name (RU)</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Tg ID</TableHead>
              <TableHead>Code Tavar</TableHead>
              <TableHead>Article</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{product.name_uz}</TableCell>
                <TableCell>{product.name_ru}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{getCategoryName(product.category)}</TableCell>
                <TableCell>{getUnitName(product.unity)}</TableCell>
                <TableCell>{product.tg_id || "—"}</TableCell>
                <TableCell>{product.code || "—"}</TableCell>
                <TableCell>{product.article || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteProduct(product.id)}
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
    </div>
  )
}
