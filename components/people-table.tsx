"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { CustomDragLayer } from "./custom-drag-layer"

interface Person {
  id: number
  name: string
  email: string
  company: string
  role: string
  lastActivity: string
  engagement: string
  status: string
  sentimentGrade: "Positive" | "Neutral" | "Negative"
}

interface PeopleTableProps {
  people: Person[]
  selectedColumns: string[]
  onRowClick: (person: Person) => void
  onColumnReorder: (draggedColumnId: string, targetColumnId: string) => void
}

const columnLabels = {
  name: "Name",
  company: "Company",
  role: "Role",
  lastActivity: "Last Activity",
  engagement: "Engagement",
  status: "Status",
  sentimentGrade: "Sentiment Grade",
}

const columnWidths = {
  name: "min-w-[200px]",
  company: "min-w-[150px]",
  role: "min-w-[150px]",
  lastActivity: "min-w-[150px]",
  engagement: "min-w-[120px]",
  status: "min-w-[100px]",
  sentimentGrade: "min-w-[150px]",
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
    <TableHead
      ref={(node) => drag(drop(node))}
      className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] whitespace-nowrap ${
        columnWidths[columnId]
      } ${isDragging ? "opacity-50" : ""} ${className}`}
    >
      <span className="cursor-move">{columnLabels[columnId]}</span>
    </TableHead>
  )
}

export function PeopleTable({ people, selectedColumns, onRowClick, onColumnReorder }: PeopleTableProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto -mx-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#1f1f1f]">
              {selectedColumns.map((columnId, index) => (
                <DraggableTableHead
                  key={columnId}
                  columnId={columnId}
                  onColumnReorder={onColumnReorder}
                  className={index === 0 ? "pl-6" : ""}
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person) => (
              <TableRow
                key={person.id}
                className="cursor-pointer hover:bg-[#1a1a1a] border-b border-[#1f1f1f]"
                onClick={() => onRowClick(person)}
              >
                {selectedColumns.map((columnId, index) => (
                  <TableCell
                    key={columnId}
                    className={`p-2 whitespace-nowrap ${columnWidths[columnId]} ${index === 0 ? "pl-6" : ""}`}
                  >
                    {columnId === "name" && (
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://avatar.vercel.sh/${person.name}.png`} alt={person.name} />
                          <AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{person.name}</div>
                          <div className="text-sm text-muted-foreground">{person.email}</div>
                        </div>
                      </div>
                    )}
                    {columnId === "company" && person.company}
                    {columnId === "role" && person.role}
                    {columnId === "lastActivity" && person.lastActivity}
                    {columnId === "engagement" && (
                      <div
                        className={`
                        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm
                        ${
                          person.engagement === "High"
                            ? "bg-[#2B1D13] text-[#FFA066]"
                            : person.engagement === "Medium"
                              ? "bg-[#1A1D2B] text-[#7B93FF]"
                              : "bg-[#1A1A1A] text-[#909090]"
                        }
                      `}
                      >
                        {person.engagement}
                      </div>
                    )}
                    {columnId === "status" && (
                      <div
                        className={`
                        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm
                        ${
                          person.status === "Active"
                            ? "bg-[#132B1B] text-[#66D19E]"
                            : person.status === "Away"
                              ? "bg-[#2B1A1A] text-[#FF7676]"
                              : "bg-[#1A1A1A] text-[#909090]"
                        }
                      `}
                      >
                        {person.status}
                      </div>
                    )}
                    {columnId === "sentimentGrade" && (
                      <span
                        className={`px-2 py-1 rounded ${
                          person.sentimentGrade === "Positive"
                            ? "bg-green-500/20 text-green-500"
                            : person.sentimentGrade === "Neutral"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {person.sentimentGrade}
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

