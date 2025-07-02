"use server"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { Session } from "next-auth"
import { revalidatePath } from "next/cache"
import z from "zod"
import { categorySchema, productSchema, purchaseSchema, saleSchema, signUpSchema } from "./validations"

const prisma = new PrismaClient()

interface CustomUser {
  id: string
  email: string
  name: string | null
  role: string
}

async function getUser(): Promise<CustomUser> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }
  return session.user as CustomUser
}

// Auth Actions
export async function signUp(data: z.infer<typeof signUpSchema>) {
  try {
    const validatedData = signUpSchema.parse(data)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return { success: false, error: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to create user" }
  }
}

// Product Actions
export async function createProduct(data: z.infer<typeof productSchema>) {
  try {
    await getUser()
    const validatedData = productSchema.parse(data)

    const existingSku = await prisma.product.findUnique({
      where: { sku: validatedData.sku },
    })

    if (existingSku) {
      return { success: false, error: "SKU already exists" }
    }

    const product = await prisma.product.create({
      data: validatedData,
      include: {
        category: true,
      },
    })

    revalidatePath("/products")
    revalidatePath("/dashboard")
    return { success: true, data: product }
  } catch (error) {
    return { success: false, error: "Failed to create product" }
  }
}

export async function updateProduct(id: number, data: z.infer<typeof productSchema>) {
  try {
    await getUser()
    const validatedData = productSchema.parse(data)

    const existingSku = await prisma.product.findFirst({
      where: {
        sku: validatedData.sku,
        NOT: { id },
      },
    })

    if (existingSku) {
      return { success: false, error: "SKU already exists" }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
      include: {
        category: true,
      },
    })

    revalidatePath("/products")
    revalidatePath("/dashboard")
    return { success: true, data: product }
  } catch (error) {
    return { success: false, error: "Failed to update product" }
  }
}

export async function deleteProduct(id: number) {
  try {
    await getUser()

    // Check if product has sales or purchases
    const productWithTransactions = await prisma.product.findUnique({
      where: { id },
      include: {
        sales: true,
        purchases: true,
      },
    })

    if (productWithTransactions?.sales.length || productWithTransactions?.purchases.length) {
      return { success: false, error: "Cannot delete product with existing transactions" }
    }

    await prisma.product.delete({
      where: { id },
    })

    revalidatePath("/products")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete product" }
  }
}

export async function getProducts(search?: string, categoryId?: number) {
  try {
    await getUser()

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return products
  } catch (error) {
    return []
  }
}

export async function getAvailableProducts() {
  try {
    await getUser()

    const products = await prisma.product.findMany({
      where: {
        quantity: { gt: 0 },
      },
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return products
  } catch (error) {
    return []
  }
}

// Sale Actions
export async function createSale(data: z.infer<typeof saleSchema>) {
  try {
    const user = await getUser()
    const validatedData = saleSchema.parse(data)

    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    })

    if (!product) {
      return { success: false, error: "Product not found" }
    }

    if (product.quantity < validatedData.quantity) {
      return { success: false, error: "Insufficient stock" }
    }

    // Create sale and update product quantity in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          ...validatedData,
          userId: user.id!,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              brand: true,
              costPrice: true,
              salePrice: true,
              quantity: true,
              minStock: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      await tx.product.update({
        where: { id: validatedData.productId },
        data: {
          quantity: {
            decrement: validatedData.quantity,
          },
        },
      })

      return sale
    })

    revalidatePath("/sales")
    revalidatePath("/products")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: "Failed to create sale" }
  }
}

export async function getSales(search?: string) {
  try {
    await getUser()

    const where: any = {}

    if (search) {
      where.OR = [
        { customer: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
        { product: { sku: { contains: search, mode: "insensitive" } } },
        { product: { brand: { contains: search, mode: "insensitive" } } },
      ]
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        soldAt: "desc",
      },
    })

    return sales
  } catch (error) {
    return []
  }
}

// Purchase Actions
export async function createPurchase(data: z.infer<typeof purchaseSchema>) {
  try {
    const user = await getUser()
    const validatedData = purchaseSchema.parse(data)

    // Create purchase and update product quantity in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          ...validatedData,
          userId: user.id!,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              brand: true,
              costPrice: true,
              salePrice: true,
              quantity: true,
              minStock: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      await tx.product.update({
        where: { id: validatedData.productId },
        data: {
          quantity: {
            increment: validatedData.quantity,
          },
        },
      })

      return purchase
    })

    revalidatePath("/purchases")
    revalidatePath("/products")
    revalidatePath("/dashboard")
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: "Failed to create purchase" }
  }
}

export async function getPurchases(search?: string) {
  try {
    await getUser()

    const where: any = {}

    if (search) {
      where.OR = [
        { supplier: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
        { product: { sku: { contains: search, mode: "insensitive" } } },
        { product: { brand: { contains: search, mode: "insensitive" } } },
      ]
    }

    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        purchasedAt: "desc",
      },
    })

    return purchases
  } catch (error) {
    return []
  }
}

// Category Actions
export async function createCategory(data: z.infer<typeof categorySchema>) {
  try {
    await getUser()
    const validatedData = categorySchema.parse(data)

    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name },
    })

    if (existingCategory) {
      return { success: false, error: "Category already exists" }
    }

    const category = await prisma.category.create({
      data: validatedData,
    })

    revalidatePath("/categories")
    return { success: true, data: category }
  } catch (error) {
    return { success: false, error: "Failed to create category" }
  }
}

export async function updateCategory(id: number, data: z.infer<typeof categorySchema>) {
  try {
    await getUser()
    const validatedData = categorySchema.parse(data)

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: validatedData.name,
        NOT: { id },
      },
    })

    if (existingCategory) {
      return { success: false, error: "Category already exists" }
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath("/categories")
    revalidatePath("/products")
    return { success: true, data: category }
  } catch (error) {
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategory(id: number) {
  try {
    await getUser()

    const categoryWithProducts = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (categoryWithProducts?._count.products && categoryWithProducts._count.products > 0) {
      return { success: false, error: "Cannot delete category with existing products" }
    }

    await prisma.category.delete({
      where: { id },
    })

    revalidatePath("/categories")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete category" }
  }
}

export async function getCategories() {
  try {
    await getUser()

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return categories
  } catch (error) {
    return []
  }
}

// Dashboard Data
export async function getDashboardData() {
  try {
    await getUser()

    const [
      totalProducts,
      totalCategories,
      lowStockProducts,
      recentSales,
      recentPurchases,
      salesByMonth,
      categoriesWithProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({
        where: {
          quantity: {
            lte: prisma.product.fields.minStock,
          },
        },
      }),
      prisma.sale.findMany({
        take: 5,
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          soldAt: "desc",
        },
      }),
      prisma.purchase.findMany({
        take: 5,
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          purchasedAt: "desc",
        },
      }),
      prisma.sale.groupBy({
        by: ["soldAt"],
        _sum: {
          salePrice: true,
        },
        orderBy: {
          soldAt: "desc",
        },
        take: 12,
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
    ])

    // Calculate KPIs
    const stockValue = await prisma.product.aggregate({
      _sum: {
        costPrice: true,
      },
    })

    const totalSales = await prisma.sale.aggregate({
      _sum: {
        salePrice: true,
      },
    })

    const totalPurchases = await prisma.purchase.aggregate({
      _sum: {
        costPrice: true,
      },
    })

    const monthlySales = await prisma.sale.aggregate({
      _sum: {
        salePrice: true,
      },
      where: {
        soldAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    })

    // Calculate profit analysis
    const profitAnalysis = await prisma.product.findMany({
      include: {
        sales: {
          select: {
            quantity: true,
          },
        },
      },
      take: 10,
      orderBy: {
        sales: {
          _count: "desc",
        },
      },
    })

    const salesVsPurchases = salesByMonth.map((sale, index) => ({
      month: new Date(sale.soldAt).toLocaleDateString("en-US", { month: "short" }),
      sales: Number(sale._sum.salePrice || 0),
      purchases: Number(totalPurchases._sum.costPrice || 0) / 12, // Approximate monthly
      profit: Number(sale._sum.salePrice || 0) - Number(totalPurchases._sum.costPrice || 0) / 12,
    }))

    return {
      kpis: {
        stockValue: Number(stockValue._sum.costPrice || 0),
        totalProfit: Number(totalSales._sum.salePrice || 0) - Number(totalPurchases._sum.costPrice || 0),
        monthlySales: Number(monthlySales._sum.salePrice || 0),
        lowStockItems: lowStockProducts,
      },
      recentSales,
      categoryDistribution: categoriesWithProducts,
      salesByMonth,
      profitAnalysis: profitAnalysis.map((product) => ({
        product: product.name,
        costPrice: Number(product.costPrice),
        salePrice: Number(product.salePrice),
        profit: Number(product.salePrice) - Number(product.costPrice),
        quantity: product.sales.reduce((sum, sale) => sum + sale.quantity, 0),
      })),
      salesVsPurchases,
    }
  } catch (error) {
    // Return empty data if user not authenticated
    return {
      kpis: {
        stockValue: 0,
        totalProfit: 0,
        monthlySales: 0,
        lowStockItems: 0,
      },
      recentSales: [],
      categoryDistribution: [],
      salesByMonth: [],
      profitAnalysis: [],
      salesVsPurchases: [],
    }
  }
}

// Search functionality
export async function globalSearch(query: string) {
  try {
    await getUser()

    if (!query || query.length < 2) {
      return {
        products: [],
        sales: [],
        purchases: [],
        categories: [],
      }
    }

    const [products, sales, purchases, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          category: true,
        },
        take: 5,
      }),
      prisma.sale.findMany({
        where: {
          OR: [
            { customer: { contains: query, mode: "insensitive" } },
            { product: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        take: 5,
      }),
      prisma.purchase.findMany({
        where: {
          OR: [
            { supplier: { contains: query, mode: "insensitive" } },
            { product: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        take: 5,
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        include: {
          _count: {
            select: { products: true },
          },
        },
        take: 5,
      }),
    ])

    return {
      products,
      sales,
      purchases,
      categories,
    }
  } catch (error) {
    return {
      products: [],
      sales: [],
      purchases: [],
      categories: [],
    }
  }
}
