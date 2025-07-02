"use client"

import * as React from "react"
import { Settings, Palette, Monitor, Sun, Moon, Zap, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const colorThemes = [
  { name: "Purple", value: "purple", color: "bg-purple-500", primary: "262 83% 58%" },
  { name: "Blue", value: "blue", color: "bg-blue-500", primary: "221 83% 53%" },
  { name: "Green", value: "green", color: "bg-green-500", primary: "142 76% 36%" },
  { name: "Orange", value: "orange", color: "bg-orange-500", primary: "25 95% 53%" },
  { name: "Pink", value: "pink", color: "bg-pink-500", primary: "330 81% 60%" },
  { name: "Indigo", value: "indigo", color: "bg-indigo-500", primary: "239 84% 67%" },
]

export function SettingsSidebar() {
  const [open, setOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [selectedColor, setSelectedColor] = React.useState("purple")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleColorChange = (colorTheme: (typeof colorThemes)[0]) => {
    setSelectedColor(colorTheme.value)
    // Update CSS custom properties
    const root = document.documentElement
    root.style.setProperty("--primary", colorTheme.primary)
    root.style.setProperty("--sidebar-primary", colorTheme.primary)
    root.style.setProperty("--sidebar-ring", colorTheme.primary)
    root.style.setProperty("--ring", colorTheme.primary)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-4 w-4" />
        <span className="sr-only">Open settings</span>
      </Button>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-left">Customize</SheetTitle>
              <SheetDescription className="text-left">Personalize your dashboard experience</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Appearance</Label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="gap-2 h-auto p-3 flex-col"
              >
                <Sun className="h-4 w-4" />
                <span className="text-xs">Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="gap-2 h-auto p-3 flex-col"
              >
                <Moon className="h-4 w-4" />
                <span className="text-xs">Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="gap-2 h-auto p-3 flex-col"
              >
                <Monitor className="h-4 w-4" />
                <span className="text-xs">System</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Color Theme Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Color Theme</Label>
              <Badge variant="secondary" className="ml-auto text-xs">
                Pro
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {colorThemes.map((colorTheme) => (
                <Button
                  key={colorTheme.value}
                  variant={selectedColor === colorTheme.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleColorChange(colorTheme)}
                  className="gap-2 h-auto p-3 justify-start"
                >
                  <div className={`h-4 w-4 rounded-full ${colorTheme.color}`} />
                  <span className="text-xs">{colorTheme.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Dashboard Layout */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Layout Options</Label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="text-sm font-medium">Compact Mode</div>
                  <div className="text-xs text-muted-foreground">Reduce spacing and padding</div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="text-sm font-medium">Sidebar Position</div>
                  <div className="text-xs text-muted-foreground">Left or right sidebar</div>
                </div>
                <Button variant="outline" size="sm">
                  Left
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reset Settings */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setTheme("system")
                handleColorChange(colorThemes[0])
              }}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
