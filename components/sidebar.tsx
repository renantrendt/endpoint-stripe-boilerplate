"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  Users,
  AlertTriangle,
  Star,
  Ticket,
  Brain,
  Mail,
  Calendar,
  Target,
  Network,
  Zap,
  MessageSquare,
  ChevronLeft,
  LucideLink,
  BarChart2,
} from "lucide-react"
import { useState } from "react"

const routes = [
  {
    label: "Explore",
    items: [
      {
        label: "Companies",
        icon: Building2,
        href: "/companies",
      },
      {
        label: "People",
        icon: Users,
        href: "/people",
      },
    ],
  },
  {
    label: "Risk Management",
    items: [
      {
        label: "AI Risk Analysis",
        icon: BarChart2,
        href: "/risk-analysis",
      },
      {
        label: "At Risk Customers",
        icon: AlertTriangle,
        href: "/risk",
      },
      {
        label: "Best Customers",
        icon: Star,
        href: "/best-customers",
      },
      {
        label: "ICP Analysis",
        icon: Target,
        href: "/icp",
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        label: "Ticket Summary",
        icon: Ticket,
        href: "/tickets",
      },
      {
        label: "Project Analysis",
        icon: Brain,
        href: "/projects",
      },
      {
        label: "Solutions Library",
        icon: Zap,
        href: "/solutions",
      },
    ],
  },
  {
    label: "Engagement",
    items: [
      {
        label: "Email Campaigns",
        icon: Mail,
        href: "/emails",
      },
      {
        label: "Meetings",
        icon: Calendar,
        href: "/meetings",
      },
      {
        label: "Conversations",
        icon: MessageSquare,
        href: "/conversations",
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        label: "Network Effects",
        icon: Network,
        href: "/network",
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative bg-sidebar text-white transition-all duration-300 ease-in-out h-screen flex flex-col border-r border-[#313131]",
        isCollapsed ? "w-[52px]" : "w-56",
      )}
    >
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between p-4">
          <span className={cn("text-xl font-bold transition-opacity duration-300", isCollapsed && "opacity-0")}>
            Wordware
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("rounded-lg p-1.5", isCollapsed && "absolute left-0 right-0 mx-auto bg-sidebar top-4")}
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
          </button>
        </div>
        <nav className="flex-1 space-y-2 px-2 overflow-hidden">
          {routes.map((section, index) => (
            <div key={index}>
              {section.label && (
                <h2
                  className={cn(
                    "mb-2 px-4 text-xs font-semibold text-gray-400 uppercase transition-opacity duration-300",
                    isCollapsed && "opacity-0",
                  )}
                >
                  {section.label}
                </h2>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors relative h-9",
                        "hover:bg-[#252525]",
                        pathname === item.href ? "bg-[#171717] text-white" : "text-gray-400",
                        isCollapsed && "justify-center px-2",
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed ? "mr-0" : "mr-3")} />
                      <span className={cn("transition-opacity duration-300", isCollapsed && "opacity-0 absolute")}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className={cn("border-t border-gray-700 p-4", isCollapsed && "px-2")}>
          <Link
            href="/integrations"
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors h-9",
              isCollapsed && "justify-center px-2",
            )}
          >
            <LucideLink className={cn("h-5 w-5 flex-shrink-0", isCollapsed ? "mr-0" : "mr-3")} />
            <span className={cn("transition-opacity duration-300", isCollapsed && "opacity-0 absolute")}>
              Integrations
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

