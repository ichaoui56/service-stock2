"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import { CategoryDialog } from "./category-dialog"
import { deleteCategory } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: number
  name: string
  _count: {
    products: number
  }
}

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const { toast } = useToast()

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const result = await deleteCategory(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{category._count.products} products</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <CategoryDialog category={category}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CategoryDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                    disabled={category._count.products > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
