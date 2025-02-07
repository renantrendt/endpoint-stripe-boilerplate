"use client"

import { useRef, useEffect } from "react"

interface TrendLineProps {
  data: number[]
  color?: string
  height?: number
  width?: number | string
  glowIntensity?: "high" | "medium" | "low"
  animated?: boolean
}

export function TrendLine({
  data = [],
  color = "#FFA066",
  height = 120,
  width = "100%",
  glowIntensity = "medium",
  animated = false, // Changed from true to false
}: TrendLineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set up the canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear the canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate points
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * rect.width,
      y: rect.height - (value / Math.max(...data)) * rect.height * 0.8,
    }))

    // Create gradient for the fill
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
    const rgbaColor = color.startsWith("#")
      ? `rgba(${Number.parseInt(color.slice(1, 3), 16)}, ${Number.parseInt(color.slice(3, 5), 16)}, ${Number.parseInt(color.slice(5, 7), 16)}`
      : color.replace("rgb(", "rgba(").replace(")", "")

    gradient.addColorStop(0, `${rgbaColor}, 0.1)`)
    gradient.addColorStop(1, `${rgbaColor}, 0)`)

    const drawLine = (points: Array<{ x: number; y: number }>) => {
      if (points.length === 0) return

      // Draw fill
      ctx.beginPath()
      ctx.moveTo(points[0].x, rect.height)
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, rect.height)
          ctx.lineTo(point.x, point.y)
        } else {
          const prevPoint = points[index - 1]
          const currPoint = point
          const ctrl1 = {
            x: (prevPoint.x + currPoint.x) / 2,
            y: prevPoint.y,
          }
          const ctrl2 = {
            x: (prevPoint.x + currPoint.x) / 2,
            y: currPoint.y,
          }
          ctx.bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, currPoint.x, currPoint.y)
        }
      })

      // Complete the fill path
      if (points.length > 0) {
        ctx.lineTo(points[points.length - 1].x, rect.height)
      }
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw the line
      ctx.beginPath()
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          const prevPoint = points[index - 1]
          const currPoint = point
          const ctrl1 = {
            x: (prevPoint.x + currPoint.x) / 2,
            y: prevPoint.y,
          }
          const ctrl2 = {
            x: (prevPoint.x + currPoint.x) / 2,
            y: currPoint.y,
          }
          ctx.bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, currPoint.x, currPoint.y)
        }
      })
      ctx.strokeStyle = color
      ctx.globalAlpha = 1
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw glow effect
    const glowColors = {
      high: [
        { offset: 0, alpha: 0.3 },
        { offset: 0.5, alpha: 0.15 },
        { offset: 1, alpha: 0.05 },
      ],
      medium: [
        { offset: 0, alpha: 0.2 },
        { offset: 0.5, alpha: 0.1 },
        { offset: 1, alpha: 0.03 },
      ],
      low: [
        { offset: 0, alpha: 0.1 },
        { offset: 0.5, alpha: 0.05 },
        { offset: 1, alpha: 0.02 },
      ],
    }

    // Draw glow
    glowColors[glowIntensity].forEach(({ alpha }) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.globalAlpha = alpha
      ctx.lineWidth = 4
      drawLine(points)
    })

    drawLine(points)
  }, [data, color, glowIntensity, animated])

  if (!data || data.length === 0) {
    return <div style={{ height: `${height}px`, width: typeof width === "string" ? width : `${width}px` }} />
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: typeof width === "string" ? width : `${width}px`,
        height: `${height}px`,
      }}
      className="rounded-md"
    />
  )
}

