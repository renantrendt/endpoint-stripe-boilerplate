"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Info, TrendingDown, TrendingUp } from "lucide-react"

interface RiskFactor {
  name: string
  score: number
  trend: "up" | "down" | "stable"
  description: string
}

interface Company {
  id: string
  name: string
  overallRiskScore: number
  riskFactors: RiskFactor[]
}

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "TechNova Solutions",
    overallRiskScore: 75,
    riskFactors: [
      {
        name: "Usage Decline",
        score: 80,
        trend: "down",
        description: "Product usage has decreased by 15% in the last month",
      },
      {
        name: "Support Tickets",
        score: 70,
        trend: "up",
        description: "Increase in the number of critical support tickets",
      },
      { name: "Feature Adoption", score: 60, trend: "stable", description: "Slow adoption of new key features" },
    ],
  },
  {
    id: "2",
    name: "GreenEco Innovations",
    overallRiskScore: 45,
    riskFactors: [
      {
        name: "Contract Renewal",
        score: 50,
        trend: "down",
        description: "Upcoming contract renewal with no engagement",
      },
      {
        name: "Product Feedback",
        score: 40,
        trend: "stable",
        description: "Neutral feedback on recent product updates",
      },
      { name: "Market Position", score: 30, trend: "up", description: "Improving market position in their industry" },
    ],
  },
  {
    id: "3",
    name: "QuantumLeap AI",
    overallRiskScore: 20,
    riskFactors: [
      { name: "Usage Growth", score: 10, trend: "up", description: "Significant increase in product usage" },
      { name: "Feature Adoption", score: 15, trend: "up", description: "Quick adoption of new features" },
      {
        name: "Customer Satisfaction",
        score: 25,
        trend: "down",
        description: "High satisfaction scores in recent survey",
      },
    ],
  },
]

export function AIRiskAnalysis() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const handleCompanySelect = (companyId: string) => {
    const company = mockCompanies.find((c) => c.id === companyId)
    setSelectedCompany(company || null)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1A1A] border-[#2F2F2F]">
        <CardHeader>
          <CardTitle className="text-white">AI Risk Analysis</CardTitle>
          <CardDescription className="text-muted-foreground">
            Select a company to view its AI-generated risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {mockCompanies.map((company) => (
              <Button
                key={company.id}
                variant={selectedCompany?.id === company.id ? "default" : "outline"}
                onClick={() => handleCompanySelect(company.id)}
                className={
                  selectedCompany?.id === company.id ? "bg-wordware-purple text-white" : "text-muted-foreground"
                }
              >
                {company.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCompany && (
        <Card className="bg-[#1A1A1A] border-[#2F2F2F]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>{selectedCompany.name}</span>
              <span className="text-2xl font-bold">Risk Score: {selectedCompany.overallRiskScore}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedCompany.riskFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{factor.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">{factor.score}</span>
                      {factor.trend === "up" && <TrendingUp className="text-red-500" />}
                      {factor.trend === "down" && <TrendingDown className="text-green-500" />}
                      {factor.trend === "stable" && <Info className="text-blue-500" />}
                    </div>
                  </div>
                  <Progress value={factor.score} className="h-2" />
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

