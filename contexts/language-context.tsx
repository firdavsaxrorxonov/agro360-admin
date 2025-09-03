"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "uz" | "ru"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  uz: {
    // Menyu va asosiy sahifa
    menu: "Menyu",
    dashboard: "Boshqaruv paneli",
    products: "Mahsulotlar",
    categories: "Kategoriyalar",
    orders: "Buyurtmalar",
    users: "Foydalanuvchilar",
    settings: "Sozlamalar",
    profile: "Profil",
    logout: "Chiqish",
    language: "Til",
    theme: "Mavzu",
    light: "Yorug'",
    dark: "Qorong'u",
    system: "Tizim",
    save: "Saqlash",
    cancel: "Bekor qilish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    create: "Yaratish",
    update: "Yangilash",

    // Dashboard uchun qo‘shimcha
    welcomeMessage: "Xush kelibsiz! Do‘koningizdagi yangiliklar mana bu yerda.",
    totalProducts: "Jami mahsulotlar",
    activeProducts: "Inventarda faol mahsulotlar",
    totalUsers: "Jami foydalanuvchilar",
    registeredUsers: "Ro‘yxatdan o‘tgan foydalanuvchilar",
    totalOrders: "Jami buyurtmalar",
    ordersThisMonth: "Bu oygi buyurtmalar",
    revenue: "Daromad",
    totalRevenue: "Bu oygi jami daromad",
    conversionRate: "Konversiya ko‘rsatkichi",
    visitorsToCustomers: "Mehmonlardan mijozlarga",
    pageViews: "Sahifa ko‘rishlar",
    totalPageViews: "Bugungi jami sahifa ko‘rishlar",
    productCategories: "Mahsulot kategoriyalari",

    // Categories sahifasi uchun qo‘shimcha
    categoriesTitle: "Kategoriyalar",
    categoriesSubtitle: "Mahsulot kategoriyalarini boshqarish",
    addCategory: "Kategoriya qo‘shish",
    noCategories: "Hech qanday kategoriya topilmadi. Boshlash uchun birinchi kategoriyani yarating."
  },

  ru: {
    // Меню и основная страница
    menu: "Меню",
    dashboard: "Панель управления",
    products: "Продукты",
    categories: "Категории",
    orders: "Заказы",
    users: "Пользователи",
    settings: "Настройки",
    profile: "Профиль",
    logout: "Выйти",
    language: "Язык",
    theme: "Тема",
    light: "Светлая",
    dark: "Темная",
    system: "Системная",
    save: "Сохранить",
    cancel: "Отмена",
    edit: "Редактировать",
    delete: "Удалить",
    create: "Создать",
    update: "Обновить",

    // Дополнительно для Dashboard
    welcomeMessage: "Добро пожаловать! Вот что происходит в вашем магазине.",
    totalProducts: "Всего товаров",
    activeProducts: "Активные товары на складе",
    totalUsers: "Всего пользователей",
    registeredUsers: "Зарегистрированные пользователи",
    totalOrders: "Всего заказов",
    ordersThisMonth: "Заказы в этом месяце",
    revenue: "Доход",
    totalRevenue: "Общий доход за месяц",
    conversionRate: "Коэффициент конверсии",
    visitorsToCustomers: "Посетителей в клиентов",
    pageViews: "Просмотры страниц",
    totalPageViews: "Всего просмотров сегодня",
    productCategories: "Категории товаров",

    // Для страницы категорий
    categoriesTitle: "Категории",
    categoriesSubtitle: "Управляйте категориями товаров",
    addCategory: "Добавить категорию",
    noCategories: "Категории не найдены. Создайте первую категорию, чтобы начать."
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "uz" || savedLanguage === "ru")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.uz] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
