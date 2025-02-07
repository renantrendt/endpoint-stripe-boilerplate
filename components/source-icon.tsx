import { FileSpreadsheet, Link } from "lucide-react"

type SourceType = "salesforce" | "hubspot" | "zendesk" | "csv"

interface SourceIconProps {
  source: SourceType
  className?: string
}

export function SourceIcon({ source, className = "h-5 w-5" }: SourceIconProps) {
  if (source === "csv") {
    return <FileSpreadsheet className={className} />
  }
  // Use Link icon for all integrations
  return <Link className={className} />
}

