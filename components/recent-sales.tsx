import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface RecentSalesProps {
  sales: Array<{
    id: number
    quantity: number
    salePrice: number
    customer: string | null
    product: {
      name: string
      brand: string
    }
  }>
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {sale.customer?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer || "Guest Customer"}</p>
            <p className="text-sm text-muted-foreground">
              {sale.product.brand} {sale.product.name}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-semibold">${Number(sale.salePrice).toFixed(2)}</p>
            <Badge variant="secondary" className="text-xs h-5">
              Qty: {sale.quantity}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
