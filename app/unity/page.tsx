"use client"

import { useState, useMemo } from "react"
import { Layout } from "@/components/layout/layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit } from "lucide-react"
import { Pagination } from "@/components/products/pagination"
import { motion, AnimatePresence } from "framer-motion"

interface Unit {
  id: number
  nameUz: string
  nameRu: string
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([
    { id: 1, nameUz: "Dona", nameRu: "Штука" },
    { id: 2, nameUz: "Kilogramm", nameRu: "Килограмм" },
    { id: 3, nameUz: "Litr", nameRu: "Литр" },
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const ITEMS_PER_PAGE = 10

  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return units.slice(start, start + ITEMS_PER_PAGE)
  }, [units, currentPage])

  const handleCreateUnit = (data: Omit<Unit, "id">) => {
    const newUnit: Unit = {
      ...data,
      id: Math.max(...units.map(u => u.id), 0) + 1,
    }
    setUnits(prev => [newUnit, ...prev])
  }

  const handleUpdateUnit = (id: number, data: Omit<Unit, "id">) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...data } : u))
  }

  const handleDeleteUnit = (id: number) => setUnits(prev => prev.filter(u => u.id !== id))

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<Unit, "id">) => {
    if (editingUnit) {
      handleUpdateUnit(editingUnit.id, data)
      setEditingUnit(null)
    } else {
      handleCreateUnit(data)
    }
    setIsFormOpen(false)
  }

  const handleFormClose = () => {
    setEditingUnit(null)
    setIsFormOpen(false)
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Units</h1>
              <p className="text-muted-foreground">Manage your measurement units</p>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Unit
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name (UZ)</TableHead>
                  <TableHead>Name (RU)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.id}</TableCell>
                    <TableCell>{unit.nameUz}</TableCell>
                    <TableCell>{unit.nameRu}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditUnit(unit)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteUnit(unit.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {Math.ceil(units.length / ITEMS_PER_PAGE) > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(units.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Modal Form with Animation */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-6 rounded-lg w-96"
                >
                  <h2 className="text-xl font-bold mb-4">{editingUnit ? "Edit Unit" : "Add Unit"}</h2>
                  <Input
                    placeholder="Name (Uz)"
                    value={editingUnit?.nameUz || ""}
                    onChange={(e) =>
                      setEditingUnit(prev => prev ? { ...prev, nameUz: e.target.value } : { id: 0, nameUz: e.target.value, nameRu: "" })
                    }
                    className="mb-4"
                  />
                  <Input
                    placeholder="Name (Ru)"
                    value={editingUnit?.nameRu || ""}
                    onChange={(e) =>
                      setEditingUnit(prev => prev ? { ...prev, nameRu: e.target.value } : { id: 0, nameUz: "", nameRu: e.target.value })
                    }
                    className="mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleFormClose}>Cancel</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                      handleFormSubmit({ nameUz: editingUnit?.nameUz || "", nameRu: editingUnit?.nameRu || "" })
                    }}>Save</Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
