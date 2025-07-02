"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search } from "lucide-react"
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

interface ProductsTableProps {
  products: Product[]
  categories: Category[]
}

export function ProductsTable({ products, categories }: ProductsTableProps) {
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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
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

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono">{product.sku}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>${Number(product.costPrice).toFixed(2)}</TableCell>
                <TableCell>${Number(product.salePrice).toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Badge variant={product.quantity <= product.minStock ? "destructive" : "default"}>
                    {product.quantity <= product.minStock ? "Low Stock" : "In Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ProductDialog categories={categories} product={product}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </ProductDialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
