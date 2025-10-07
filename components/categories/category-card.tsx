"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Category } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface CategoryCardProps {
  category: Category
  productCount?: number
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
  onViewProducts?: (category: Category) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const { t } = useLanguage()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const confirmDelete = (id: number) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirmed = () => {
    if (deleteId !== null) {
      onDelete(deleteId)
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <Card
        className="group hover:shadow-md transition-shadow
        w-full max-w-[200px] sm:max-w-[220px] md:max-w-[250px]
        h-[260px] sm:h-[280px] md:h-[300px] mx-auto"
      >
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm sm:text-base">{category.nameUz}</h3>
              <p className="text-xs text-muted-foreground">{category.nameRu}</p>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-2 space-y-3">
          {category.image && (
            <div className="rounded-md overflow-hidden bg-muted h-[90px] sm:h-[110px]">
              <img
                src={category.image || "/placeholder.svg?height=120&width=200"}
                alt={category.nameUz}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs sm:text-sm"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-3 w-2 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t("categoriyEdit")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => confirmDelete(category.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("ConDel")}</DialogTitle>
            <DialogDescription>
              {t("sure")}
            </DialogDescription>
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
    </>
  )
}
