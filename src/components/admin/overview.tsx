"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1320,
  },
  {
    name: "Feb",
    total: 1530,
  },
  {
    name: "Mar",
    total: 1890,
  },
  {
    name: "Apr",
    total: 2390,
  },
  {
    name: "May",
    total: 2870,
  },
  {
    name: "Jun",
    total: 3290,
  },
  {
    name: "Jul",
    total: 3580,
  },
  {
    name: "Aug",
    total: 3920,
  },
  {
    name: "Sep",
    total: 4480,
  },
  {
    name: "Oct",
    total: 4890,
  },
  {
    name: "Nov",
    total: 5230,
  },
  {
    name: "Dec",
    total: 5780,
  },
]

export const Overview_v2414 = () => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
