"use client"

import { useState, useMemo } from "react"
import { PeopleTable } from "@/components/people-table"
import { PeopleHeader } from "@/components/people-header"
import { DetailsSidebar } from "@/components/details-sidebar"
import { ImportButton } from "@/components/import-button"

interface Project {
  id: string
  name: string
  usage: number
  lastActiveDate: string
  usageTrend: number[]
}

interface Person {
  id: number
  name: string
  email: string
  company: string
  role: string
  lastActivity: string
  engagement: string
  status: string
  projects: Project[]
  sentimentGrade: "Positive" | "Neutral" | "Negative"
}

const initialPeople: Person[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@technova.com",
    company: "TechNova Solutions",
    role: "CTO",
    lastActivity: "2 hours ago",
    engagement: "High",
    status: "Active",
    projects: [
      {
        id: "1",
        name: "AI Integration",
        usage: 85,
        lastActiveDate: "1 hour ago",
        usageTrend: [70, 75, 78, 80, 82, 85, 85, 85, 85],
      },
      {
        id: "2",
        name: "Cloud Migration",
        usage: 60,
        lastActiveDate: "3 hours ago",
        usageTrend: [40, 45, 50, 55, 58, 60, 60, 60, 60],
      },
    ],
    sentimentGrade: "Positive",
  },
  {
    id: 2,
    name: "Emma Wilson",
    email: "emma@greeneco.com",
    company: "GreenEco Innovations",
    role: "Product Manager",
    lastActivity: "1 day ago",
    engagement: "Medium",
    status: "Away",
    projects: [
      {
        id: "1",
        name: "Sustainable Dashboard",
        usage: 75,
        lastActiveDate: "1 day ago",
        usageTrend: [60, 65, 68, 70, 72, 75, 75, 75, 75],
      },
    ],
    sentimentGrade: "Neutral",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael@quantumleap.ai",
    company: "QuantumLeap AI",
    role: "Data Scientist",
    lastActivity: "3 hours ago",
    engagement: "High",
    status: "Active",
    projects: [
      {
        id: "1",
        name: "ML Pipeline Optimization",
        usage: 90,
        lastActiveDate: "2 hours ago",
        usageTrend: [80, 82, 85, 87, 88, 90, 90, 90, 90],
      },
      {
        id: "2",
        name: "Data Visualization Tool",
        usage: 70,
        lastActiveDate: "5 hours ago",
        usageTrend: [55, 60, 63, 65, 68, 70, 70, 70, 70],
      },
    ],
    sentimentGrade: "Positive",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@cybershield.com",
    company: "CyberShield Security",
    role: "Security Analyst",
    lastActivity: "5 days ago",
    engagement: "Low",
    status: "Inactive",
    projects: [
      {
        id: "1",
        name: "Threat Detection System",
        usage: 30,
        lastActiveDate: "5 days ago",
        usageTrend: [50, 45, 40, 35, 32, 30, 30, 30, 30],
      },
    ],
    sentimentGrade: "Negative",
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex@biogenetics.com",
    company: "BioGenetics Corp",
    role: "Research Lead",
    lastActivity: "2 days ago",
    engagement: "Medium",
    status: "Active",
    projects: [
      {
        id: "1",
        name: "Gene Sequencing Analysis",
        usage: 80,
        lastActiveDate: "2 days ago",
        usageTrend: [65, 68, 72, 75, 78, 80, 80, 80, 80],
      },
      {
        id: "2",
        name: "Protein Folding Simulation",
        usage: 65,
        lastActiveDate: "3 days ago",
        usageTrend: [50, 55, 58, 60, 62, 65, 65, 65, 65],
      },
    ],
    sentimentGrade: "Neutral",
  },
]

export default function PeoplePage() {
  const [people, setPeople] = useState(initialPeople)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState("lastActivity")
  const [selectedColumns, setSelectedColumns] = useState([
    "name",
    "company",
    "role",
    "lastActivity",
    "engagement",
    "status",
  ])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const filteredPeople = useMemo(() => {
    return people.filter(
      (person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [people, searchQuery])

  const sortedPeople = useMemo(() => {
    return [...filteredPeople].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return -1
      if (a[sortColumn] > b[sortColumn]) return 1
      return 0
    })
  }, [filteredPeople, sortColumn])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSort = (column: string) => {
    setSortColumn(column)
  }

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]))
  }

  const handleColumnReorder = (draggedColumnId: string, targetColumnId: string) => {
    setSelectedColumns((prevColumns) => {
      const draggedIndex = prevColumns.indexOf(draggedColumnId)
      const targetIndex = prevColumns.indexOf(targetColumnId)
      const newColumns = [...prevColumns]
      newColumns.splice(draggedIndex, 1)
      newColumns.splice(targetIndex, 0, draggedColumnId)
      return newColumns
    })
  }

  const handleRowClick = (person: Person) => {
    setSelectedPerson(person)
  }

  const handleNavigatePerson = (direction: "up" | "down") => {
    if (selectedPerson) {
      const currentIndex = sortedPeople.findIndex((person) => person.id === selectedPerson.id)
      if (direction === "up" && currentIndex > 0) {
        setSelectedPerson(sortedPeople[currentIndex - 1])
      } else if (direction === "down" && currentIndex < sortedPeople.length - 1) {
        setSelectedPerson(sortedPeople[currentIndex + 1])
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PeopleHeader
        totalPeople={people.length}
        onSearch={handleSearch}
        onSort={handleSort}
        onColumnToggle={handleColumnToggle}
        selectedColumns={selectedColumns}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">People</h1>
            <p className="text-sm text-muted-foreground">{people.length.toLocaleString()} people</p>
          </div>
          <ImportButton importType="Person" />
        </div>
      </PeopleHeader>
      <PeopleTable
        people={sortedPeople}
        selectedColumns={selectedColumns}
        onRowClick={handleRowClick}
        onColumnReorder={handleColumnReorder}
      />
      <DetailsSidebar
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        company={
          selectedPerson
            ? {
                name: selectedPerson.name,
                lastActivity: selectedPerson.lastActivity,
                intentTrend: [50, 55, 60, 58, 62, 65, 70, 68, 72], // example data
                intentLevel: selectedPerson.engagement,
                status: selectedPerson.status,
                lastSalesActivity: "N/A",
                recordOwner: "N/A",
                employees: "N/A",
                source: "csv",
                projects: selectedPerson.projects,
                timeline: [
                  {
                    id: "1",
                    type: "chat",
                    title: "Last Interaction",
                    timestamp: selectedPerson.lastActivity,
                    summary: `Last interaction with ${selectedPerson.name} from ${selectedPerson.company}.`,
                  },
                ],
                supportTickets: [3, 5, 4, 6, 8, 7, 9, 10, 8], // example data
              }
            : null
        }
        onNavigate={handleNavigatePerson}
        hasPrevious={selectedPerson ? sortedPeople.findIndex((person) => person.id === selectedPerson.id) > 0 : false}
        hasNext={
          selectedPerson
            ? sortedPeople.findIndex((person) => person.id === selectedPerson.id) < sortedPeople.length - 1
            : false
        }
      />
    </div>
  )
}

