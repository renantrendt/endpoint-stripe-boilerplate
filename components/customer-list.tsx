import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Flame, TrendingUp, Snowflake } from "lucide-react"
import { TrendLine } from "./trend-line"
import { SourceIcon } from "./source-icon"

// Updated dummy data with trend data and source
const customers = [
  {
    id: 1,
    name: "Global-e",
    status: "Active",
    lastActivity: "Just now",
    risk: "High",
    source: "salesforce" as const,
    trendData: [10, 12, 15, 18, 20, 22, 25, 28, 30], // Upward trend
  },
  {
    id: 2,
    name: "MITALUMNI",
    status: "At Risk",
    lastActivity: "4 minutes ago",
    risk: "High",
    source: "hubspot" as const,
    trendData: [30, 28, 25, 20, 18, 15, 12, 10, 8], // Downward trend
  },
  {
    id: 3,
    name: "RapidSOS",
    status: "Inactive",
    lastActivity: "5 minutes ago",
    risk: "Medium",
    source: "zendesk" as const,
    trendData: [15, 18, 14, 20, 15, 22, 18, 25, 20], // Oscillating
  },
  {
    id: 4,
    name: "Centific",
    status: "Active",
    lastActivity: "3 hours ago",
    risk: "Low",
    source: "csv" as const,
    trendData: [20, 20, 20, 21, 22, 25, 28, 30, 32], // Stable then up
  },
  {
    id: 5,
    name: "Momentus",
    status: "At Risk",
    lastActivity: "5 days ago",
    risk: "Low",
    source: "salesforce" as const,
    trendData: [25, 23, 20, 18, 15, 13, 10, 8, 5], // Downward trend
  },
]

function RiskBadge({ risk }: { risk: string }) {
  const icons = {
    High: Flame,
    Medium: TrendingUp,
    Low: Snowflake,
  }
  const Icon = icons[risk as keyof typeof icons]

  return (
    <div
      className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm
      ${
        risk === "High"
          ? "bg-[#2B1D13] text-[#FFA066]"
          : risk === "Medium"
            ? "bg-[#1A1D2B] text-[#7B93FF]"
            : "bg-[#1A1A1A] text-[#909090]"
      }
    `}
    >
      <Icon className="h-3.5 w-3.5" />
      {risk}
    </div>
  )
}

export function CustomerList() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead className="w-[200px]">Intent Trend (L30D)</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://avatar.vercel.sh/${customer.name}.png`} alt={customer.name} />
                      <AvatarFallback>{customer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{customer.name}</span>
                      <SourceIcon source={customer.source} className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`
                    inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm
                    ${
                      customer.status === "Active"
                        ? "bg-[#132B1B] text-[#66D19E]"
                        : customer.status === "At Risk"
                          ? "bg-[#2B1A1A] text-[#FF7676]"
                          : "bg-[#1A1A1A] text-[#909090]"
                    }
                  `}
                  >
                    {customer.status}
                  </div>
                </TableCell>
                <TableCell>
                  <RiskBadge risk={customer.risk} />
                </TableCell>
                <TableCell>
                  <TrendLine
                    data={customer.trendData}
                    color={customer.risk === "High" ? "#FFA066" : customer.risk === "Medium" ? "#7B93FF" : "#909090"}
                  />
                </TableCell>
                <TableCell>{customer.lastActivity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

