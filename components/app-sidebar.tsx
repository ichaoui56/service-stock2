"use client"

import { Home, Package, ShoppingCart, TrendingUp, BarChart3, FolderOpen, Zap, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    badge: null,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    badge: "24",
  },
  {
    title: "Categories",
    url: "/categories",
    icon: FolderOpen,
    badge: null,
  },
  {
    title: "Sales",
    url: "/sales",
    icon: ShoppingCart,
    badge: "12",
  },
  {
    title: "Purchases",
    url: "/purchases",
    icon: TrendingUp,
    badge: null,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    badge: null,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              TechVault
            </span>
            <span className="text-xs text-muted-foreground font-medium">Pro Edition</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 px-3 py-2">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="h-11 rounded-xl transition-all duration-200 hover:bg-primary/10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-lg"
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 px-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 px-3 py-2">
            ACCOUNT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton className="h-11 rounded-xl transition-all duration-200 hover:bg-primary/10">
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Store Manager</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
