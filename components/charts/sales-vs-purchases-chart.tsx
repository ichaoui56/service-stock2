"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface SalesVsPurchasesChartProps {
  data: Array<{
    month: string
    sales: number
    purchases: number
    profit: number
  }>
}

export function SalesVsPurchasesChart({ data }: SalesVsPurchasesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value, name) => [
            `$${value}`,
            name === "sales" ? "Sales" : name === "purchases" ? "Purchases" : "Profit",
          ]}
          labelStyle={{ color: "#000" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
          name="Sales"
        />
        <Line
          type="monotone"
          dataKey="purchases"
          stroke="#ef4444"
          strokeWidth={3}
          dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
          name="Purchases"
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
          name="Net Profit"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
