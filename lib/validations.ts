import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  salePrice: z.number().min(0, "Sale price must be positive"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  minStock: z.number().min(0, "Minimum stock must be non-negative"),
})

export const saleSchema = z.object({
  productId: z.number().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  salePrice: z.number().min(0, "Sale price must be positive"),
  customer: z.string().optional(),
})

export const purchaseSchema = z.object({
  productId: z.number().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  supplier: z.string().min(1, "Supplier is required"),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
})

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})
