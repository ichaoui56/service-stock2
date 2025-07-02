import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SalesTable } from "@/components/sales/sales-table"
import { SaleDialog } from "@/components/sales/sale-dialog"
import { getSales, getAvailableProducts } from "@/lib/actions"

export default async function SalesPage() {
  const [sales, products] = await Promise.all([getSales(), getAvailableProducts()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Record and track all sales transactions.</p>
        </div>
        <SaleDialog products={products}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Sale
          </Button>
        </SaleDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>A complete record of all sales transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable sales={sales} />
        </CardContent>
      </Card>
    </div>
  )
}
