import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@techvault.com" },
    update: {},
    create: {
      email: "admin@techvault.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Smartphones" },
      update: {},
      create: { name: "Smartphones" },
    }),
    prisma.category.upsert({
      where: { name: "Laptops" },
      update: {},
      create: { name: "Laptops" },
    }),
    prisma.category.upsert({
      where: { name: "Tablets" },
      update: {},
      create: { name: "Tablets" },
    }),
    prisma.category.upsert({
      where: { name: "Smartwatches" },
      update: {},
      create: { name: "Smartwatches" },
    }),
    prisma.category.upsert({
      where: { name: "Accessories" },
      update: {},
      create: { name: "Accessories" },
    }),
  ])

  // Create products
  const products = [
    {
      name: "iPhone 15 Pro",
      sku: "IP15P-001",
      brand: "Apple",
      costPrice: 899.0,
      salePrice: 1199.0,
      quantity: 25,
      minStock: 5,
      categoryId: categories[0].id,
    },
    {
      name: "Samsung Galaxy S24",
      sku: "SGS24-001",
      brand: "Samsung",
      costPrice: 749.0,
      salePrice: 999.0,
      quantity: 30,
      minStock: 5,
      categoryId: categories[0].id,
    },
    {
      name: 'MacBook Pro 14"',
      sku: "MBP14-001",
      brand: "Apple",
      costPrice: 1599.0,
      salePrice: 1999.0,
      quantity: 15,
      minStock: 3,
      categoryId: categories[1].id,
    },
    {
      name: "iPad Air",
      sku: "IPA-001",
      brand: "Apple",
      costPrice: 449.0,
      salePrice: 599.0,
      quantity: 2,
      minStock: 5,
      categoryId: categories[2].id,
    },
    {
      name: "Apple Watch Series 9",
      sku: "AWS9-001",
      brand: "Apple",
      costPrice: 299.0,
      salePrice: 399.0,
      quantity: 20,
      minStock: 5,
      categoryId: categories[3].id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
