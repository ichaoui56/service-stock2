"use client"

import { useState, useEffect } from "react"
import { Search, Package, ShoppingCart, TrendingUp, BarChart3, FolderOpen, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { globalSearch } from "@/lib/actions"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

const commands = [
  {
    group: "Navigation",
    items: [
      { icon: Home, label: "Dashboard", href: "/dashboard", shortcut: "D" },
      { icon: Package, label: "Products", href: "/products", shortcut: "P" },
      { icon: FolderOpen, label: "Categories", href: "/categories", shortcut: "C" },
      { icon: ShoppingCart, label: "Sales", href: "/sales", shortcut: "S" },
      { icon: TrendingUp, label: "Purchases", href: "/purchases", shortcut: "U" },
      { icon: BarChart3, label: "Reports", href: "/reports", shortcut: "R" },
    ],
  },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>({
    products: [],
    sales: [],
    purchases: [],
    categories: [],
  })
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const searchData = async () => {
      if (query.length >= 2) {
        setIsSearching(true)
        try {
          const results = await globalSearch(query)
          setSearchResults(results)
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults({
          products: [],
          sales: [],
          purchases: [],
          categories: [],
        })
      }
    }

    const debounceTimer = setTimeout(searchData, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelect = (item: any) => {
    setOpen(false)
    if (item.href) {
      router.push(item.href)
    } else if (item.action) {
      console.log(`Executing action: ${item.action}`)
    }
  }

  const hasSearchResults =
    searchResults.products.length > 0 ||
    searchResults.sales.length > 0 ||
    searchResults.purchases.length > 0 ||
    searchResults.categories.length > 0

  return (
    <>
      {/* Search trigger button */}
      <div className="relative flex-1 cursor-pointer" onClick={() => setOpen(true)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <div className="pl-10 pr-4 py-2 bg-muted/50 border-0 rounded-md text-sm text-muted-foreground hover:bg-muted/70 transition-colors">
          Search products, orders, customers...
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." value={query} onValueChange={setQuery} />
        <CommandList>
          {!query && (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              {commands.map((group) => (
                <div key={group.group}>
                  <CommandGroup heading={group.group}>
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.label}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                            {item.shortcut}
                          </kbd>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </div>
              ))}
            </>
          )}

          {query && isSearching && <CommandEmpty>Searching...</CommandEmpty>}

          {query && !isSearching && !hasSearchResults && <CommandEmpty>No results found for "{query}"</CommandEmpty>}

          {query && !isSearching && hasSearchResults && (
            <>
              {searchResults.products.length > 0 && (
                <CommandGroup heading="Products">
                  {searchResults.products.map((product: any) => (
                    <CommandItem
                      key={`product-${product.id}`}
                      onSelect={() => handleSelect({ href: `/products` })}
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.brand} • {product.sku} • Stock: {product.quantity}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ${product.salePrice}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.sales.length > 0 && (
                <CommandGroup heading="Sales">
                  {searchResults.sales.map((sale: any) => (
                    <CommandItem
                      key={`sale-${sale.id}`}
                      onSelect={() => handleSelect({ href: `/sales` })}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{sale.product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Customer: {sale.customer || "Guest"} • Qty: {sale.quantity}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ${sale.salePrice}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.purchases.length > 0 && (
                <CommandGroup heading="Purchases">
                  {searchResults.purchases.map((purchase: any) => (
                    <CommandItem
                      key={`purchase-${purchase.id}`}
                      onSelect={() => handleSelect({ href: `/purchases` })}
                      className="flex items-center gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{purchase.product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Supplier: {purchase.supplier} • Qty: {purchase.quantity}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ${purchase.costPrice}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.categories.length > 0 && (
                <CommandGroup heading="Categories">
                  {searchResults.categories.map((category: any) => (
                    <CommandItem
                      key={`category-${category.id}`}
                      onSelect={() => handleSelect({ href: `/categories` })}
                      className="flex items-center gap-2"
                    >
                      <FolderOpen className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-muted-foreground">{category._count.products} products</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
