import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CategoryDialog } from "@/components/categories/category-dialog"
import { getCategories } from "@/lib/actions"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage product categories for better organization.</p>
        </div>
        <CategoryDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CategoryDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>Organize your products into categories for easier management.</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesTable categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
