import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Grid3X3, List } from "lucide-react"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductDialog } from "@/components/products/product-dialog"
import { getProducts, getCategories } from "@/lib/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductsTable } from "@/components/products/products-table"

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-muted-foreground mt-2">Manage your inventory and product catalog with style.</p>
        </div>
        <ProductDialog categories={categories}>
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </ProductDialog>
      </div>

      <Tabs defaultValue="grid" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
            <TabsTrigger value="grid" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <List className="h-4 w-4" />
              Table View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="space-y-6">
          <ProductsGrid products={products} categories={categories} />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>A detailed list of all products in your store</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsTable products={products} categories={categories} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
