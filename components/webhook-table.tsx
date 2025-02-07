"use client"

import { useState } from "react"
import { WebhookEvent } from "@/types/webhook"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<WebhookEvent>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "succeeded" ? "success" : "destructive"}>
          {status || 'pending'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "customer_name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("customer_name") as string
      return name || '-'
    },
  },
  {
    accessorKey: "customer_email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("customer_email") as string
      return email || '-'
    },
  },
  {
    accessorKey: "customer_phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("customer_phone") as string
      return phone || '-'
    },
  },
  {
    accessorKey: "amount_received",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount_received") as number
      const data = row.original
      return amount ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: data.currency || 'USD'
      }).format(amount / 100) : '-'
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return date.toLocaleString()
    },
  },
]

interface WebhookTableProps {
  events: WebhookEvent[]
  onEventSelect: (event: WebhookEvent) => void
}

export function WebhookTable({ events, onEventSelect }: WebhookTableProps) {
  const handleRowClick = (row: any) => {
    console.log('WebhookTable - Row clicked:', row)
    console.log('WebhookTable - Row data:', row.original)
    onEventSelect(row.original)
  }

  return (
    <DataTable
      columns={columns}
      data={events}
      onRowClick={handleRowClick}
    />
  )
}
