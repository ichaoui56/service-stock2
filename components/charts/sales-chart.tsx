"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SalesChartProps {
  data: Array<{
    soldAt: Date
    _sum: {
      salePrice: number | null
    }
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  const chartData = data
    .map((item) => ({
      month: new Date(item.soldAt).toLocaleDateString("en-US", { month: "short" }),
      sales: Number(item._sum.salePrice || 0),
    }))
    .reverse()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, "Sales"]} labelStyle={{ color: "#000" }} />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot={{ fill: "#8884d8" }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
