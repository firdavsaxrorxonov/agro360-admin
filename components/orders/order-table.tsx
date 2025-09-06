// OrderTable.tsx
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { Order } from "@/types/order"
import { useLanguage } from "@/contexts/language-context"

interface OrderTableProps {
  orders: Order[]
  onViewOrder: (order: Order) => void
}

export function OrderTable({ orders, onViewOrder }: OrderTableProps) {
  const { t } = useLanguage()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("orderId")}</TableHead>
            <TableHead>{t("customerName")}</TableHead>
            <TableHead>{t("items") || "Items"}</TableHead>
            <TableHead>{t("total")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("actions") || "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                </div>
              </TableCell>
              <TableCell>{order.items.length} {t("items") || "items"}</TableCell>
              <TableCell className="font-medium">{order.amount} UZS</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => onViewOrder(order)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
