"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/categories/category-card"
import { CategoryForm } from "@/components/categories/category-form"
import { CategoryProducts } from "@/components/categories/category-products"
import { Plus } from "lucide-react"
import type { Product, Category } from "@/types/product"

// Mock data - in a real app, this would come from an API
const mockCategories: Category[] = [
  { id: 1, nameUz: "Elektronika", nameRu: "Электроника", image: "/electronics-components.png" },
  { id: 2, nameUz: "Kiyim", nameRu: "Одежда", image: "/diverse-clothing-rack.png" },
  { id: 3, nameUz: "Oziq-ovqat", nameRu: "Продукты питания", image: "/diverse-food-spread.png" },
  { id: 4, nameUz: "Kitoblar", nameRu: "Книги", image: "/stack-of-diverse-books.png" },
  { id: 5, nameUz: "Sport", nameRu: "Спорт", image: "/diverse-group-playing-various-sports.png" },
  { id: 6, nameUz: "Uy-joy", nameRu: "Дом и сад", image: "/cozy-cabin-interior.png" },
]

const mockProducts: Product[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  nameUz: `Mahsulot ${i + 1}`,
  nameRu: `Продукт ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 10,
  category: mockCategories[Math.floor(Math.random() * mockCategories.length)].nameUz,
  description: `Bu mahsulot haqida ma'lumot ${i + 1}`,
  unit: Math.random() > 0.5 ? "piece" : "kg",
  createdAt: new Date().toISOString(),
}))

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [products] = useState<Product[]>(mockProducts)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false)

  const getProductCount = (categoryName: string) => {
    return products.filter((product) => product.category === categoryName).length
  }

  const handleCreateCategory = (categoryData: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Math.max(...categories.map((c) => c.id)) + 1,
    }
    setCategories((prev) => [newCategory, ...prev])
  }

  const handleUpdateCategory = (categoryData: Omit<Category, "id">) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id ? { ...categoryData, id: editingCategory.id } : category,
        ),
      )
      setEditingCategory(null)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDeleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((category) => category.id !== id))
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
              <p className="text-muted-foreground">Manage your product categories</p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                productCount={getProductCount(category.nameUz)}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onViewProducts={handleViewProducts}
              />
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No categories found. Create your first category to get started.</p>
            </div>
          )}

          {/* Category Form Modal */}
          <CategoryForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            editingCategory={editingCategory}
          />

          {/* Category Products Modal */}
          <CategoryProducts
            isOpen={isProductsModalOpen}
            onClose={() => setIsProductsModalOpen(false)}
            category={selectedCategory}
            products={products}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
