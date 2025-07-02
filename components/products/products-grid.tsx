"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Star } from "lucide-react"
import { ProductDialog } from "./product-dialog"
import { deleteProduct } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  sku: string
  brand: string
  costPrice: number
  salePrice: number
  quantity: number
  minStock: number
  category: {
    id: number
    name: string
  }
}

interface Category {
  id: number
  name: string
}

interface ProductsGridProps {
  products: Product[]
  categories: Category[]
}

// Mock product images based on category
const getProductImage = (categoryName: string, productName: string) => {
  const category = categoryName.toLowerCase()
  if (category.includes("phone")) {
    return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(productName)}`
  } else if (category.includes("laptop")) {
    return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(productName)}`
  } else if (category.includes("tablet")) {
    return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(productName)}`
  } else if (category.includes("watch")) {
    return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(productName)}`
  }
  return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(productName)}`
}

export function ProductsGrid({ products, categories }: ProductsGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const { toast } = useToast()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category.id.toString() === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-muted/50 border-0">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="product-card group border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                <img
                  src={getProductImage(product.category.name, product.name) || "/placeholder.svg"}
                  alt={product.name}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge variant={product.quantity <= product.minStock ? "destructive" : "secondary"} className="text-xs">
                  {product.quantity <= product.minStock ? "Low Stock" : "In Stock"}
                </Badge>
              </div>
              <div className="absolute top-3 left-3">
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                  {product.category.name}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  {/* <div className="font-semibold text-lg">${product.salePrice.toFixed(2)}</div> */}
                  <div className="text-xs text-muted-foreground">Stock: {product.quantity}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ProductDialog categories={categories} product={product}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </ProductDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">No products found matching your criteria.</div>
        </div>
      )}
    </div>
  )
}
