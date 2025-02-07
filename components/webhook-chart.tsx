"use client"

import { Card, Title, AreaChart } from "@tremor/react"
import { useState, useEffect } from "react"
import { WebhookEvent } from "@/types/webhook"

interface WebhookChartProps {
  events: WebhookEvent[]
}

interface ChartData {
  date: string
  "Webhooks/min": number
}

export function WebhookChart({ events }: WebhookChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    console.log('%cWebhookChart - Events received:', 'color: #059669; font-weight: bold;', events)
    if (!events?.length) {
      console.log('%cWebhookChart - No events to display', 'color: #059669; font-weight: bold;')
      return
    }
    // Group events by minute
    const groupedByMinute = events.reduce((acc, event) => {
      const date = new Date(event.created_at)
      const minute = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      ).toISOString()

      acc[minute] = (acc[minute] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convert to chart data format and sort by date
    const data = Object.entries(groupedByMinute)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleTimeString(),
        "Webhooks/min": count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    console.log('%cWebhookChart - Processed data:', 'color: #059669; font-weight: bold;', {
      dataPoints: data.length,
      firstPoint: data[0],
      lastPoint: data[data.length - 1]
    })
    setChartData(data)
  }, [events])

  return (
    <div>
      <Title className="mb-4">Webhooks per Minute</Title>
      <AreaChart
        className="h-72"
        data={chartData}
        index="date"
        categories={["Webhooks/min"]}
        colors={["indigo"]}
        showLegend={false}
        showGridLines={false}
        showAnimation={true}
        curveType="monotone"
        valueFormatter={(value) => `${value} webhooks`}
      />
    </div>
  )
}
