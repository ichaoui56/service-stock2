"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface ProfitAnalysisChartProps {
  data: Array<{
    product: string
    costPrice: number
    salePrice: number
    profit: number
    quantity: number
  }>
}

export function ProfitAnalysisChart({ data }: ProfitAnalysisChartProps) {
  const chartData = data.map((item) => ({
    name: item.product.length > 15 ? item.product.substring(0, 15) + "..." : item.product,
    cost: item.costPrice * item.quantity,
    revenue: item.salePrice * item.quantity,
    profit: item.profit * item.quantity,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
        />
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
            name === "cost" ? "Cost" : name === "revenue" ? "Revenue" : "Profit",
          ]}
          labelStyle={{ color: "#000" }}
        />
        <Legend />
        <Bar dataKey="cost" fill="#ef4444" name="Cost" radius={[2, 2, 0, 0]} />
        <Bar dataKey="revenue" fill="#22c55e" name="Revenue" radius={[2, 2, 0, 0]} />
        <Bar dataKey="profit" fill="#3b82f6" name="Profit" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
