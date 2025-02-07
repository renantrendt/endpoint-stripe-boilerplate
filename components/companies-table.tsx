"use client"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
// import { SourceIcon } from "./source-icon"
import { TrendLine } from "./trend-line"
import Image from "next/image"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { CustomDragLayer } from "./custom-drag-layer"

interface Company {
  name: string
  lastActivity: string
  usageTrend: number[]
  tickets: number[]
  sentiment: number
  activeProjects: number
  status: string
  source: "salesforce" | "csv" | "hubspot" | "zendesk"
}

interface CompaniesTableProps {
  companies: Company[]
  selectedColumns: string[]
  onRowClick: (company: Company) => void
  onColumnReorder: (draggedColumnId: string, targetColumnId: string) => void
}

const columnLabels = {
  name: "Name",
  lastActivity: "Last Activity",
  usageTrend: "Usage Trend (L30D)",
  tickets: "Tickets (L30D)",
  sentiment: "Sentiment (L30D)",
  activeProjects: "Active Projects",
  status: "Status",
}

const columnWidths = {
  name: "min-w-[200px]",
  lastActivity: "min-w-[150px]",
  usageTrend: "min-w-[180px]",
  tickets: "min-w-[150px]",
  sentiment: "min-w-[150px]",
  activeProjects: "min-w-[120px]",
  status: "min-w-[120px]",
}

const DraggableTableHead = ({ columnId, onColumnReorder, className = "" }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { id: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "COLUMN",
    drop: (draggedItem: { id: string }) => {
      if (draggedItem.id !== columnId) {
        onColumnReorder(draggedItem.id, columnId)
      }
    },
  })

  return (
    <th
      ref={(node) => drag(drop(node))}
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] whitespace-nowrap ${
        columnWidths[columnId]
      } ${isDragging ? "opacity-50" : ""} ${className}`}
    >
      <span className="cursor-move">{columnLabels[columnId]}</span>
    </th>
  )
}

export function CompaniesTable({ companies, selectedColumns, onRowClick, onColumnReorder }: CompaniesTableProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto -mx-6">
        <Table>
          <thead>
            <tr>
              {selectedColumns.map((columnId, index) => (
                <DraggableTableHead
                  key={columnId}
                  columnId={columnId}
                  onColumnReorder={onColumnReorder}
                  className={index === 0 ? "pl-6" : ""}
                />
              ))}
            </tr>
          </thead>
          <TableBody>
            {companies.map((company) => (
              <TableRow
                key={company.name}
                className="cursor-pointer hover:bg-[#1a1a1a] border-b border-[#1f1f1f]"
                onClick={() => onRowClick(company)}
              >
                {selectedColumns.map((columnId, index) => (
                  <TableCell
                    key={columnId}
                    className={`p-2 whitespace-nowrap ${columnWidths[columnId]} ${index === 0 ? "pl-6" : ""}`}
                  >
                    {columnId === "name" && (
                      <div className="flex items-center space-x-2">
                        <Image
                          src={`https://avatar.vercel.sh/${company.name}.png`}
                          alt={`${company.name} logo`}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{company.name}</span>
                      </div>
                    )}
                    {columnId === "lastActivity" && company.lastActivity}
                    {columnId === "usageTrend" && (
                      <div className="h-[30px]">
                        <TrendLine
                          data={company.usageTrend}
                          height={30}
                          color={
                            company.sentiment >= 0.7
                              ? "#FFA066"
                              : company.sentiment >= 0.4
                                ? "#7B93FF"
                                : "#909090"
                          }
                        />
                      </div>
                    )}
                    {columnId === "tickets" && (
                      <div className="h-[30px]">
                        <TrendLine data={company.tickets} height={30} color="#FF5D0A" />
                      </div>
                    )}
                    {columnId === "sentiment" && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-sm ${
                          company.sentiment >= 0.7
                            ? "bg-[#2B1D13] text-[#FFA066]"
                            : company.sentiment >= 0.4
                              ? "bg-[#1A1D2B] text-[#7B93FF]"
                              : "bg-[#1A1A1A] text-[#909090]"
                        }`}
                      >
                        {(company.sentiment * 100).toFixed(0)}%
                      </span>
                    )}
                    {columnId === "activeProjects" && <span className="text-sm">{company.activeProjects}</span>}
                    {columnId === "status" && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-sm ${
                          company.status === "Active"
                            ? "bg-[#132B1B] text-[#66D19E]"
                            : company.status === "At Risk"
                              ? "bg-[#2B1A1A] text-[#FF7676]"
                              : "bg-[#1A1A1A] text-[#909090]"
                        }`}
                      >
                        {company.status}
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CustomDragLayer columnLabels={columnLabels} />
    </DndProvider>
  )
}

