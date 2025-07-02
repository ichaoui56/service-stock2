"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Calendar } from "lucide-react"
import { format } from "date-fns"

export function ReportsContent() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generateReport = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setReportData({
        summary: {
          totalSales: 15420.5,
          totalPurchases: 8750.25,
          profit: 6670.25,
          transactions: 45,
        },
        transactions: [
          {
            id: 1,
            date: new Date(),
            type: "Sale",
            product: "iPhone 15 Pro",
            quantity: 2,
            amount: 2398.0,
          },
          {
            id: 2,
            date: new Date(),
            type: "Purchase",
            product: 'MacBook Pro 14"',
            quantity: 1,
            amount: -1599.0,
          },
          // Add more mock data as needed
        ],
      })
      setLoading(false)
    }, 1000)
  }

  const exportReport = () => {
    // Simulate CSV export
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Type,Product,Quantity,Amount\n" +
      reportData.transactions
        .map((t: any) => `${format(t.date, "yyyy-MM-dd")},${t.type},${t.product},${t.quantity},${t.amount}`)
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `report-${startDate}-to-${endDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select a date range to generate detailed sales and purchase reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Button onClick={generateReport} disabled={!startDate || !endDate || loading}>
              <Calendar className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      {reportData && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${reportData.summary.totalSales.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${reportData.summary.totalPurchases.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${reportData.summary.profit.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.summary.transactions}</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction Details</CardTitle>
                  <CardDescription>Detailed breakdown of all transactions in the selected period.</CardDescription>
                </div>
                <Button onClick={exportReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.transactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(transaction.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === "Sale" ? "default" : "secondary"}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.product}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
