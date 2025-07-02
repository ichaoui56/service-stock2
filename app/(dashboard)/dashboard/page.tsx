import { getDashboardData } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, AlertTriangle, Package, Users, ShoppingBag } from "lucide-react"
import { SalesChart } from "@/components/charts/sales-chart"
import { CategoryChart } from "@/components/charts/category-chart"
import { ProfitAnalysisChart } from "@/components/charts/profit-analysis-chart"
import { SalesVsPurchasesChart } from "@/components/charts/sales-vs-purchases-chart"
import { RecentSales } from "@/components/recent-sales"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, John! 👋
          </h1>
          <p className="text-muted-foreground mt-2">Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Package className="h-4 w-4" />
            Add Product
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <ShoppingBag className="h-4 w-4" />
            New Sale
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border shadow-lg bg-gradient-to-br from-green-500/10 via-background to-green-600/5">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Stock Value</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">
              ${Number(data.kpis.stockValue).toLocaleString()}
            </div>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border shadow-lg bg-gradient-to-br from-blue-500/10 via-background to-blue-600/5">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Profit</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              ${Number(data.kpis.totalProfit).toLocaleString()}
            </div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border shadow-lg bg-gradient-to-br from-purple-500/10 via-background to-purple-600/5">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Monthly Sales</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              ${Number(data.kpis.monthlySales).toLocaleString()}
            </div>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">+23% from last month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border shadow-lg bg-gradient-to-br from-orange-500/10 via-background to-orange-600/5">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">Low Stock Items</CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">{data.kpis.lowStockItems}</div>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Sales vs Purchases</CardTitle>
                <CardDescription>Monthly comparison and profit trends</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <SalesVsPurchasesChart data={data.salesVsPurchases} />
          </CardContent>
        </Card>

        <Card className="border shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Profit Analysis</CardTitle>
                <CardDescription>Cost vs Revenue by product</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                <DollarSign className="h-3 w-3 mr-1" />
                Profitable
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ProfitAnalysisChart data={data.profitAnalysis} />
          </CardContent>
        </Card>
      </div>

      {/* Original Charts Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="col-span-4 border shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Sales Overview</CardTitle>
                <CardDescription>Monthly performance trends</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                +15.3%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart data={data.salesByMonth} />
          </CardContent>
        </Card>

        <Card className="col-span-3 border shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Category Distribution</CardTitle>
            <CardDescription>Product breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={data.categoryDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Sales</CardTitle>
            <CardDescription>Latest transactions in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales sales={data.recentSales} />
          </CardContent>
        </Card>

        <Card className="border shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent">
              <Package className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Add New Product</div>
                <div className="text-xs text-muted-foreground">Expand your inventory</div>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent">
              <ShoppingBag className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Record Sale</div>
                <div className="text-xs text-muted-foreground">Process new transaction</div>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Stock Purchase</div>
                <div className="text-xs text-muted-foreground">Restock inventory</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
