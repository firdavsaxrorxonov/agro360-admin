"use client"

import { Layout } from "@/components/layout/layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Title & Welcome Text */}
          <div>
            <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
            <p className="text-muted-foreground">{t("welcomeMessage")}</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t("totalProducts")}
              value="1,234"
              description={t("activeProducts")}
              icon={Package}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title={t("totalUsers")}
              value="856"
              description={t("registeredUsers")}
              icon={Users}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title={t("totalOrders")}
              value="2,341"
              description={t("ordersThisMonth")}
              icon={ShoppingCart}
              trend={{ value: 23, isPositive: true }}
            />
            <StatCard
              title={t("revenue")}
              value="$45,231"
              description={t("totalRevenue")}
              icon={DollarSign}
              trend={{ value: 15, isPositive: true }}
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title={t("conversionRate")}
              value="3.2%"
              description={t("visitorsToCustomers")}
              icon={TrendingUp}
              trend={{ value: 2.1, isPositive: true }}
            />
            <StatCard
              title={t("pageViews")}
              value="12,543"
              description={t("totalPageViews")}
              icon={Eye}
              trend={{ value: 5.4, isPositive: true }}
            />
            <StatCard
              title={t("categories")}
              value="24"
              description={t("productCategories")}
              icon={Package}
            />
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
