"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout/layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/categories/category-card"
import { CategoryForm } from "@/components/categories/category-form"
import { CategoryProducts } from "@/components/categories/category-products"
import { Plus, Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import type { Category } from "@/types/product"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
  const imgBaseURL = process.env.NEXT_PUBLIC_API_ImgBASE_URL ?? ""
  const token =
    typeof window !== "undefined" ? localStorage.getItem("agroAdminToken") : null
  const lang =
    typeof window !== "undefined" ? localStorage.getItem("lang") || "uz" : "uz"

  const api = axios.create({ baseURL })

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }
  api.defaults.headers.common["Accept-Language"] = lang

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/category/list/")
      if (Array.isArray(data.results)) {
        const normalized = data.results.map((cat: any) => ({
          id: cat.id,
          nameUz: cat.name_uz,
          nameRu: cat.name_ru,
          image: cat.image
            ? cat.image.startsWith("http")
              ? cat.image
              : `${imgBaseURL}${cat.image}`
            : "/placeholder.svg",
        }))
        setCategories(normalized)
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const getCategoryName = (cat: Category) => (lang === "ru" ? cat.nameRu : cat.nameUz)
  const getProductCount = (_categoryName: string) => 0

  const handleCreateCategory = async (formData: FormData) => {
    try {
      await api.post("/category/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Category created successfully")
      fetchCategories()
    } catch (error) {
      console.error(error)
      toast.error("Failed to create category")
    }
  }

  // 🔹 PATCH rasm optional
  const handleUpdateCategory = async (formData: FormData) => {
    if (!editingCategory) return
    try {
      await api.patch(`/category/${editingCategory.id}/update/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Category updated successfully")
      fetchCategories()
    } catch (error: any) {
      console.error(error.response?.data || error)
      toast.error("Failed to update category")
    } finally {
      setEditingCategory(null)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDeleteCategory = async (id: string | number) => {
    try {
      await api.delete(`/category/${id}/delete/`)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success("Category deleted")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete category")
    }
  }

  const handleViewProducts = (category: Category) => {
    setSelectedCategory(category)
    setIsProductsModalOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Categories</h1>
              <p className="text-muted-foreground">
                Manage your product categories
              </p>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={{
                    ...category,
                    nameUz: getCategoryName(category),
                  }}
                  productCount={getProductCount(getCategoryName(category))}
                  onEdit={handleEditCategory}
                  onDelete={() => handleDeleteCategory(category.id)}
                  onViewProducts={handleViewProducts}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No categories found. Create your first category to get started.
              </p>
            </div>
          )}

          <CategoryForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            editingCategory={editingCategory}
          />

          <CategoryProducts
            isOpen={isProductsModalOpen}
            onClose={() => setIsProductsModalOpen(false)}
            category={selectedCategory}
            products={[]}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
