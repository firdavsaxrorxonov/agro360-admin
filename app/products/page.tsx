"use client"

import { useState, useEffect, useMemo } from "react"
import { Layout } from "@/components/layout/layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import axios from "axios"

import { ProductTable } from "@/components/products/product-table"
import { ProductForm } from "@/components/products/product-form"
import { Pagination } from "@/components/products/pagination"
import type { Product, Category } from "@/types/product"

const ITEMS_PER_PAGE = 20

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [units, setUnits] = useState<{ id: string; name_uz: string; name_ru: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
  const token = typeof window !== "undefined" ? localStorage.getItem("agroAdminToken") : null

  const api = axios.create({ baseURL })
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`

  // Fetch categories & units
  const fetchCategoriesAndUnits = async () => {
    try {
      const [catRes, unitRes] = await Promise.all([
        api.get("/category/list/"),
        api.get("/unity/list/"),
      ])

      setCategories(
        catRes.data.results.map((c: any) => ({
          id: c.id,
          nameUz: c.name_uz,
          nameRu: c.name_ru,
        }))
      )

      setUnits(
        unitRes.data.results.map((u: any) => ({
          id: u.id,
          name_uz: u.name_uz,
          name_ru: u.name_ru,
        }))
      )
    } catch (error) {
      console.error("Failed to fetch categories or units:", error)
      alert("Error fetching categories or units. Check your API URL or server.")
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/product/list/")
      setProducts(
        (data.results || []).map((p: any) => ({
          ...p,
          category: typeof p.category === "object" ? p.category.id : p.category,
          unity: typeof p.unity === "object" ? p.unity.id : p.unity,
          tg_id: p.tg_id || "",
          code: p.code || "",
          article: p.article || "",
        }))
      )
    } catch (error) {
      console.error("Failed to fetch products:", error)
      alert("Error fetching products. Check your API URL or server.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoriesAndUnits()
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let temp = products
    if (selectedCategory !== "all") temp = temp.filter((p) => p.category === selectedCategory)
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase()
      temp = temp.filter(
        (p) =>
          p.name_uz.toLowerCase().includes(lowerSearch) ||
          p.name_ru.toLowerCase().includes(lowerSearch)
      )
    }
    return temp
  }, [products, selectedCategory, searchTerm])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/product/${id}/delete/`)
      await fetchProducts()
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
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
            <Button
              onClick={() => {
                setEditingProduct(null)
                setIsFormOpen(true)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex gap-4 flex-wrap items-center">
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />

            <div className="w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nameUz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            <>
              <ProductTable
                products={paginatedProducts}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                currentPage={currentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                units={units}
                categories={categories}
              />

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}

              <ProductForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                categories={categories}
                units={units}
                editingProduct={editingProduct}
                onSuccess={fetchProducts}
              />
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
