"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Settings,
  User,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/sidebar-context"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: FolderOpen, hasSubmenu: true },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Profile", href: "/profile", icon: User },
]

// Mock categories for sidebar
const mockCategories = [
  { id: 1, nameUz: "Elektronika", nameRu: "Электроника" },
  { id: 2, nameUz: "Kiyim", nameRu: "Одежда" },
  { id: 3, nameUz: "Oziq-ovqat", nameRu: "Продукты питания" },
  { id: 4, nameUz: "Kitoblar", nameRu: "Книги" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, close } = useSidebar()
  const { logout } = useAuth()
  const { t } = useLanguage()
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
    close()
  }

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`)
    close()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-background border-r transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b lg:hidden">
          <h2 className="text-lg font-semibold">{t("menu")}</h2>
          <Button variant="ghost" size="icon" onClick={close}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const itemName = t(item.name.toLowerCase())

            if (item.hasSubmenu && item.name === "Categories") {
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => close()}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1",
                        isActive
                          ? "bg-green-600 text-white"
                          : "text-muted-foreground hover:bg-green-600 hover:text-white",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {itemName}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                      className="p-1 h-8 w-8"
                    >
                      {categoriesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </div>

                  {categoriesExpanded && (
                    <div className="ml-6 space-y-1">
                      {mockCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.nameUz)}
                          className="block w-full text-left px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          {category.nameUz}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => close()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-green-600 text-white" : "text-muted-foreground hover:bg-green-600 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                {itemName}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-muted-foreground hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            {t("logout")}
          </Button>
        </div>
      </aside>
    </>
  )
}
