import { ReportsContent } from "@/components/reports/reports-content"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate detailed reports on sales, purchases, and profitability.</p>
      </div>
      <ReportsContent />
    </div>
  )
}
