import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PurchasesTable } from "@/components/purchases/purchases-table"
import { PurchaseDialog } from "@/components/purchases/purchase-dialog"
import { getPurchases, getProducts } from "@/lib/actions"

export default async function PurchasesPage() {
  const [purchases, products] = await Promise.all([getPurchases(), getProducts()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
          <p className="text-muted-foreground">Record inventory purchases from suppliers.</p>
        </div>
        <PurchaseDialog products={products}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Purchase
          </Button>
        </PurchaseDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>A complete record of all inventory purchases.</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchasesTable purchases={purchases} />
        </CardContent>
      </Card>
    </div>
  )
}
