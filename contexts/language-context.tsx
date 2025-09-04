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
    categoriesTitle: "Kategoriyalar",
    categoriesSubtitle: "Mahsulot kategoriyalarini boshqarish",
    addCategory: "Kategoriya qo‘shish",
    noCategories: "Hech qanday kategoriya topilmadi. Boshlash uchun birinchi kategoriyani yarating.",
    "Name (UZ)": "Nom (UZ)",
    "Name (RU)": "Nom (RU)",
    Price: "Narx",
    Category: "Kategoriya",
    Unit: "O‘lchov birligi",
    "Telegram ID": "Telegram ID",
    Code: "Kod",
    Article: "Maqola",
    "Description (UZ)": "Tavsif (UZ)",
    "Description (RU)": "Tavsif (RU)",
    Image: "Rasm",
    "Please fill all required fields": "Iltimos, barcha majburiy maydonlarni to‘ldiring",
    "Select category": "Kategoriya tanlang",
    "Select unit": "Birlik tanlang",
    "Select Telegram ID": "Telegram ID tanlang",
    "Loading categories...": "Kategoriyalar yuklanmoqda...",
    "Loading units...": "Birliklar yuklanmoqda...",
    "Loading suppliers...": "Yetkazib beruvchilar yuklanmoqda...",
    Error: "Xato",
    "Failed to fetch suppliers": "Yetkazib beruvchilarni olishda xato yuz berdi",
    Update: "Yangilash",
    "Fill in the product information below.": "Quyida mahsulot ma'lumotlarini to‘ldiring.",
    "Update the product information below.": "Quyida mahsulot ma'lumotlarini yangilang.",
  },

  ru: {
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
    categoriesTitle: "Категории",
    categoriesSubtitle: "Управляйте категориями товаров",
    addCategory: "Добавить категорию",
    noCategories: "Категории не найдены. Создайте первую категорию, чтобы начать.",
    "Name (UZ)": "Название (UZ)",
    "Name (RU)": "Название (RU)",
    Price: "Цена",
    Category: "Категория",
    Unit: "Единица измерения",
    "Telegram ID": "Telegram ID",
    Code: "Код",
    Article: "Артикул",
    "Description (UZ)": "Описание (UZ)",
    "Description (RU)": "Описание (RU)",
    Image: "Изображение",
    "Please fill all required fields": "Пожалуйста, заполните все обязательные поля",
    "Select category": "Выберите категорию",
    "Select unit": "Выберите единицу",
    "Select Telegram ID": "Выберите Telegram ID",
    "Loading categories...": "Категории загружаются...",
    "Loading units...": "Единицы загружаются...",
    "Loading suppliers...": "Поставщики загружаются...",
    Error: "Ошибка",
    "Failed to fetch suppliers": "Не удалось получить поставщиков",
    Update: "Обновить",
    "Fill in the product information below.": "Заполните информацию о продукте ниже.",
    "Update the product information below.": "Обновите информацию о продукте ниже.",
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
