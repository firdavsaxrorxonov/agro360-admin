"use client"

import { useState, useMemo } from "react"
import { Layout } from "@/components/layout/layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductTable } from "@/components/products/product-table"
import { ProductForm } from "@/components/products/product-form"
import { Pagination } from "@/components/products/pagination"
import { Plus } from "lucide-react"
import type { Product, Category } from "@/types/product"

// Mock data
const mockCategories: Category[] = [
  { id: 1, nameUz: "Elektronika", nameRu: "Электроника" },
  { id: 2, nameUz: "Kiyim", nameRu: "Одежда" },
  { id: 3, nameUz: "Oziq-ovqat", nameRu: "Продукты питания" },
  { id: 4, nameUz: "Kitoblar", nameRu: "Книги" },
]

const mockProducts: Product[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  nameUz: `Mahsulot ${i + 1}`,
  nameRu: `Продукт ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 10,
  category: mockCategories[Math.floor(Math.random() * mockCategories.length)].nameUz,
  description: `Bu mahsulot haqida ma'lumot ${i + 1}`,
  unit: Math.random() > 0.5 ? "piece" : "kg",
  createdAt: new Date().toISOString(),
}))

const ITEMS_PER_PAGE = 20

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products
    return products.filter((product) => product.category === selectedCategory)
  }, [products, selectedCategory])

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)

  const handleUpdateProduct = (id: number, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updates } : product)))
  }

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  const handleCreateProduct = (productData: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.map((p) => p.id)) + 1,
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleUpdateExistingProduct = (productData: Omit<Product, "id" | "createdAt">) => {
    if (editingProduct) {
      handleUpdateProduct(editingProduct.id, productData)
      setEditingProduct(null)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <label htmlFor="category-filter" className="text-sm font-medium">
              Filter by Category:
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.nameUz}>
                    {category.nameUz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <ProductTable
            products={paginatedProducts}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={handleEditProduct}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}

          {/* Product Form Modal */}
          <ProductForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSubmit={editingProduct ? handleUpdateExistingProduct : handleCreateProduct}
            categories={mockCategories}
            editingProduct={editingProduct}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
