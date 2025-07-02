"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

interface Sale {
  id: number
  quantity: number
  salePrice: number
  customer: string | null
  soldAt: Date
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

interface SalesTableProps {
  sales: Sale[]
}

export function SalesTable({ sales }: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSales = sales.filter((sale) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      sale.product.name.toLowerCase().includes(searchLower) ||
      sale.product.brand.toLowerCase().includes(searchLower) ||
      sale.product.sku.toLowerCase().includes(searchLower) ||
      sale.customer?.toLowerCase().includes(searchLower)
    )
  })

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + Number(sale.salePrice) * sale.quantity, 0)

  return (
    <div className="space-y-4">
      {/* Search and Stats */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total Revenue: <span className="font-semibold">${totalRevenue.toFixed(2)}</span>
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
              <TableHead>Customer</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{new Date(sale.soldAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{sale.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {sale.product.brand} • {sale.product.category.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{sale.product.sku}</TableCell>
                <TableCell>{sale.customer ? sale.customer : <Badge variant="secondary">Guest</Badge>}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>${Number(sale.salePrice).toFixed(2)}</TableCell>
                <TableCell className="font-medium">${(Number(sale.salePrice) * sale.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
