"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import type { Order } from "@/types/order";
import { useLanguage } from "@/contexts/language-context";
import axios from "axios";

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onDeleteSuccess: () => void;
}

export function OrderTable({ orders, onViewOrder, onDeleteSuccess }: OrderTableProps) {
  const { t, language } = useLanguage();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this order?") || "Delete order?")) return;

    try {
      setLoadingId(id);
      const token = localStorage.getItem("agroAdminToken");

      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/${id}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });

      onDeleteSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>{t("customerName")}</TableHead>
            <TableHead>{t("items")}</TableHead>
            <TableHead>{t("total")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.order_number}</TableCell>
              <TableCell>
                <div className="font-medium">{order.customerName}</div>
                <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
              </TableCell>
              <TableCell>{order.items.length} {t("items")}</TableCell>
              <TableCell className="font-medium">{order.amount} UZS</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onViewOrder(order)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(order.id)}
                    disabled={loadingId === order.id}
                    className="text-red-600 hover:text-red-700"
                  >
                    {loadingId === order.id ? "..." : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
