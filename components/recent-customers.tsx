"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentCustomers = [
  {
    name: "Global-e",
    action: "Opened new ticket",
    time: "2 minutes ago",
  },
  {
    name: "MITALUMNI",
    action: "Updated project status",
    time: "5 minutes ago",
  },
  {
    name: "RapidSOS",
    action: "Scheduled meeting",
    time: "10 minutes ago",
  },
]

export function RecentCustomers() {
  return (
    <div className="space-y-4">
      {recentCustomers.map((customer) => (
        <div key={customer.name} className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${customer.name}.png`} />
            <AvatarFallback>{customer.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.action}</p>
            <p className="text-xs text-muted-foreground">{customer.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

