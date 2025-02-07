"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendLine } from "./trend-line"

export function TrendLineExamples() {
  // Sample data for different trends
  const upwardTrend = [10, 20, 35, 45, 60, 75, 90]
  const downwardTrend = [90, 75, 60, 45, 35, 20, 10]
  const fluctuatingTrend = [40, 65, 35, 70, 45, 80, 60]
  const stableTrend = [50, 52, 51, 53, 50, 51, 52]

  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1A1A] border-[#2F2F2F]">
        <CardHeader>
          <CardTitle>High Intent Trends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[60px]">
            <TrendLine data={upwardTrend} color="#FFA066" glowIntensity="high" />
          </div>
          <div className="h-[60px]">
            <TrendLine data={fluctuatingTrend} color="#FFA066" glowIntensity="high" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-[#2F2F2F]">
        <CardHeader>
          <CardTitle>Medium Intent Trends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[60px]">
            <TrendLine data={stableTrend} color="#7B93FF" glowIntensity="medium" />
          </div>
          <div className="h-[60px]">
            <TrendLine data={downwardTrend} color="#7B93FF" glowIntensity="medium" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-[#2F2F2F]">
        <CardHeader>
          <CardTitle>Low Intent Trends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[60px]">
            <TrendLine data={downwardTrend} color="#909090" glowIntensity="low" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

