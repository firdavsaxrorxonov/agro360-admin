"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductTableProps {
  products: Product[]
  onUpdateProduct: (id: number, updates: Partial<Product>) => void
  onDeleteProduct: (id: number) => void
  onEditProduct: (product: Product) => void
}

export function ProductTable({ products, onUpdateProduct, onDeleteProduct, onEditProduct }: ProductTableProps) {
  const [editingPrice, setEditingPrice] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ [key: number]: string }>({})
  const [hasChanges, setHasChanges] = useState(false)

  const handlePriceDoubleClick = (product: Product) => {
    setEditingPrice(product.id)
    setEditValues((prev) => ({
      ...prev,
      [product.id]: prev[product.id] || product.price.toString()
    }))
  }

  const handlePriceChange = (productId: number, value: string) => {
    setEditValues((prev) => ({ ...prev, [productId]: value }))
    setHasChanges(true)
  }

  const saveAllChanges = () => {
    Object.entries(editValues).forEach(([id, value]) => {
      const newPrice = Number.parseFloat(value)
      if (!isNaN(newPrice) && newPrice > 0) {
        onUpdateProduct(Number(id), { price: newPrice })
      }
    })
    setEditingPrice(null)
    setHasChanges(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name (UZ)</TableHead>
              <TableHead>Name (RU)</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.nameUz}</TableCell>
                <TableCell>{product.nameRu}</TableCell>
                <TableCell className="relative w-[120px]">
                  <span
                    className="cursor-pointer hover:bg-muted px-2 py-1 rounded block text-center"
                    onDoubleClick={() => handlePriceDoubleClick(product)}
                    title="Double-click to edit"
                  >
                    ${editValues[product.id] || product.price}
                  </span>

                  {editingPrice === product.id && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white shadow-md rounded">
                      <Input
                        type="number"
                        value={editValues[product.id] || ""}
                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                        className="w-20 text-center"
                        step="0.01"
                        autoFocus
                        onBlur={() => setEditingPrice(null)}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.unit}</Badge>
                </TableCell>
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

      {hasChanges && (
        <div className="flex justify-center">
          <Button onClick={saveAllChanges} className="bg-green-600 hover:bg-green-700">
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}
