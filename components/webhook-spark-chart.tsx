"use client"

import { Card, Text, Metric, Flex, BadgeDelta, SparkAreaChart } from "@tremor/react"
import { useState, useEffect } from "react"
import { WebhookEvent } from "@/types/webhook"

interface WebhookSparkChartProps {
  events: WebhookEvent[]
}

interface SparkData {
  date: string
  value: number
}

export function WebhookSparkChart({ events }: WebhookSparkChartProps) {
  const [sparkData, setSparkData] = useState<SparkData[]>([])
  const [percentageChange, setPercentageChange] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    console.log('%cWebhookSparkChart - Events received:', 'color: #dc2626; font-weight: bold;', events)
    if (!events?.length) {
      console.log('%cWebhookSparkChart - No events to display', 'color: #dc2626; font-weight: bold;')
      return
    }
    // Group events by minute for the last hour
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    const recentEvents = events.filter(event => 
      new Date(event.created_at) >= oneHourAgo
    )
    console.log('%cWebhookSparkChart - Recent events:', 'color: #dc2626; font-weight: bold;', {
      total: recentEvents.length,
      firstEvent: recentEvents[0],
      lastEvent: recentEvents[recentEvents.length - 1]
    })

    const groupedByMinute = recentEvents.reduce((acc, event) => {
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

    // Convert to spark data format and sort by date
    const data = Object.entries(groupedByMinute)
      .map(([date, value]) => ({
        date,
        value,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate percentage change
    if (data.length >= 2) {
      const firstHalf = data.slice(0, Math.floor(data.length / 2))
      const secondHalf = data.slice(Math.floor(data.length / 2))
      
      const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.value, 0) / firstHalf.length
      const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.value, 0) / secondHalf.length
      
      const change = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100
      setPercentageChange(change)
    }

    console.log('%cWebhookSparkChart - Processed data:', 'color: #dc2626; font-weight: bold;', {
      dataPoints: data.length,
      firstPoint: data[0],
      lastPoint: data[data.length - 1],
      percentageChange
    })
    
    setSparkData(data)
    setTotal(recentEvents.length)
  }, [events])

  return (
    <Card className="w-full p-3">
      <Flex alignItems="start" justifyContent="between">
        <div>
          <Text>Webhooks Last Hour</Text>
          <Metric>{total}</Metric>
        </div>
        {percentageChange !== 0 && (
          <BadgeDelta deltaType={percentageChange >= 0 ? "increase" : "decrease"}>
            {percentageChange.toFixed(1)}%
          </BadgeDelta>
        )}
      </Flex>
      <SparkAreaChart
        data={sparkData}
        categories={["value"]}
        index="date"
        colors={["indigo"]}
        className="h-10 mt-2"
        curveType="monotone"
      />
    </Card>
  )
}
