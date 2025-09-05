"use client";

import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { OrderTable } from "@/components/orders/order-table";
import { OrderDetails } from "@/components/orders/order-details";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { Order } from "@/types/order";
import { useLanguage } from "@/contexts/language-context";

export default function OrdersPage() {
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("agroAdminToken") : null;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/list/");
      const formattedOrders: Order[] = res.data.results.map((o: any) => ({
        id: o.id,
        customerName:
          o.user?.first_name && o.user?.last_name
            ? `${o.user.first_name} ${o.user.last_name}`
            : o.name || t("noName"),
        customerEmail: o.user?.username || t("noEmail"),
        amount: o.total_price,
        createdAt: o.createdAt || new Date().toISOString(),
        items: o.items.map((item: any) => ({
          productId: item.product.id,
          productName: item.product.name_uz,
          quantity: item.quantity,
          price: item.price,
        })),
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const users = useMemo(() => {
    const u: Record<string, string> = {};
    orders.forEach((o) => {
      u[o.customerName] = o.customerName;
    });
    return Object.values(u);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchUser = selectedUser === "all" || order.customerName === selectedUser;
      const matchDate =
        !selectedDate ||
        new Date(order.createdAt).toISOString().slice(0, 10) === selectedDate;
      return matchUser && matchDate;
    });
  }, [orders, selectedUser, selectedDate]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const exportToExcel = () => {
    if (!filteredOrders.length) return;

    const usersMap: Record<string, Order[]> = {};
    filteredOrders.forEach((order) => {
      if (!usersMap[order.customerName]) usersMap[order.customerName] = [];
      usersMap[order.customerName].push(order);
    });

    Object.entries(usersMap).forEach(([userName, userOrders]) => {
      const rows: any[] = [];
      userOrders.forEach((order) => {
        order.items.forEach((item) => {
          rows.push({
            [t("orderId")]: order.id,
            [t("customerName")]: order.customerName,
            [t("customerEmail")]: order.customerEmail,
            [t("product")]: item.productName,
            [t("quantity")]: item.quantity,
            [t("price")]: item.price,
            [t("total")]: item.quantity * item.price,
            [t("date")]: new Date(order.createdAt).toLocaleDateString(),
          });
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, `${userName}_${selectedDate || "all_dates"}.xlsx`);
    });
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t("orders")}</h1>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">{t("allUsers")}</option>
              {users.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-2 rounded"
            />

            <Button onClick={exportToExcel}>{t("exportExcel")}</Button>
          </div>

          {/* Orders Table */}
          <OrderTable orders={filteredOrders} onViewOrder={handleViewOrder} />

          {/* Order Details Modal */}
          <OrderDetails
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            order={selectedOrder}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
