"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Category } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"

interface CategoryCardProps {
  category: Category
  productCount: number
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
  onViewProducts: (category: Category) => void
}

export function CategoryCard({ category, productCount, onEdit, onDelete }: CategoryCardProps) {
  const { t } = useLanguage()

  return (
    <Card className="group hover:shadow-md transition-shadow w-[250px] h-[320px] mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{category.nameUz}</h3>
            <p className="text-sm text-muted-foreground">{category.nameRu}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {category.image && (
          <div className="rounded-md overflow-hidden bg-muted h-[120px]">
            <img
              src={category.image || "/placeholder.svg?height=120&width=200"}
              alt={category.nameUz}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(category)}>
            <Edit className="h-4 w-4 mr-2" />
            {t("categoriyEdit")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(category.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
