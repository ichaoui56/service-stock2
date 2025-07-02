"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { saleSchema } from "@/lib/validations"
import { createSale } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Product {
  id: number
  name: string
  brand: string
  sku: string
  salePrice: number
  quantity: number
  category: {
    name: string
  }
}

interface SaleDialogProps {
  products: Product[]
  children: React.ReactNode
}

export function SaleDialog({ products, children }: SaleDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: 0,
      quantity: 1,
      salePrice: 0,
      customer: "",
    },
  })

  const onSubmit = async (data: any) => {
    const result = await createSale(data)

    if (result.success) {
      toast({
        title: "Success",
        description: "Sale recorded successfully",
      })
      setOpen(false)
      form.reset()
      setSelectedProduct(null)
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === Number.parseInt(productId))
    if (product) {
      setSelectedProduct(product)
      form.setValue("salePrice", Number(product.salePrice))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Sale</DialogTitle>
          <DialogDescription>Record a new sale transaction. Stock will be automatically updated.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number.parseInt(value))
                      handleProductChange(value)
                    }}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          <div className="flex flex-col">
                            <span>{product.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {product.brand} • Stock: {product.quantity}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProduct && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <div className="font-medium">{selectedProduct.name}</div>
                  <div className="text-muted-foreground">Available: {selectedProduct.quantity} units</div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max={selectedProduct?.quantity || 999}
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record Sale
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
