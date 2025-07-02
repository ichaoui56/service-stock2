import type React from "react"
import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { CommandPalette } from "@/components/command-palette"
import { UserNav } from "@/components/user-nav"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <SidebarTrigger className="h-8 w-8" />

          <div className="flex-1 flex items-center gap-4 max-w-md">
            <Suspense fallback={<div className="h-10 bg-muted/50 rounded-md flex-1 animate-pulse" />}>
              <CommandPalette />
            </Suspense>
          </div>

          <div className="flex items-center gap-2">
            <Suspense fallback={<div className="h-9 w-9 bg-muted/50 rounded-md animate-pulse" />}>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </Button>
            </Suspense>
            <ThemeToggle />
            <SettingsSidebar />
            <UserNav />
          </div>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
