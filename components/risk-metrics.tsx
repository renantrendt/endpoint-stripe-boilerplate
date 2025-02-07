"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  {
    average: 400,
    today: 240,
  },
  {
    average: 300,
    today: 139,
  },
  {
    average: 200,
    today: 980,
  },
  {
    average: 278,
    today: 390,
  },
  {
    average: 189,
    today: 480,
  },
  {
    average: 239,
    today: 380,
  },
  {
    average: 349,
    today: 430,
  },
]

export function RiskMetrics() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <Tooltip />
        <Line type="monotone" dataKey="today" stroke="#FF5D0A" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="average" stroke="#6E56CF" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

