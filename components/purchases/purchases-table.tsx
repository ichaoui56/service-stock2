"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

interface Purchase {
  id: number
  quantity: number
  costPrice: number
  supplier: string
  purchasedAt: Date
  product: {
    id: number
    name: string
    brand: string
    sku: string
    category: {
      name: string
    }
  }
}

interface PurchasesTableProps {
  purchases: Purchase[]
}

export function PurchasesTable({ purchases }: PurchasesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPurchases = purchases.filter((purchase) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      purchase.product.name.toLowerCase().includes(searchLower) ||
      purchase.product.brand.toLowerCase().includes(searchLower) ||
      purchase.product.sku.toLowerCase().includes(searchLower) ||
      purchase.supplier.toLowerCase().includes(searchLower)
    )
  })

  const totalCost = filteredPurchases.reduce((sum, purchase) => sum + Number(purchase.costPrice) * purchase.quantity, 0)

  return (
    <div className="space-y-4">
      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total Cost: <span className="font-semibold">${totalCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Cost</TableHead>
              <TableHead>Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{new Date(purchase.purchasedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{purchase.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {purchase.product.brand} • {purchase.product.category.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{purchase.product.sku}</TableCell>
                <TableCell>{purchase.supplier}</TableCell>
                <TableCell>{purchase.quantity}</TableCell>
                <TableCell>${Number(purchase.costPrice).toFixed(2)}</TableCell>
                <TableCell className="font-medium">
                  ${(Number(purchase.costPrice) * purchase.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
