"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Upload, Link } from "lucide-react"

interface ImportButtonProps {
  importType: string
}

export function ImportButton({ importType = "Item" }: ImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [integration, setIntegration] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleIntegrationChange = (value: string) => {
    setIntegration(value)
  }

  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file.name)
      // Implement file upload logic here
    }
  }

  const handleIntegrate = () => {
    console.log("Integrating with:", integration)
    // Implement integration logic here
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border border-[#313131] text-[#909090] hover:text-white bg-transparent transition-colors"
          onClick={() => setIsOpen(true)}
        >
          Import {importType}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#121212] border-l border-[#1F1F1F] focus:outline-none focus-visible:outline-none"
      >
        <SheetHeader>
          <SheetTitle>Import {importType}s</SheetTitle>
          <SheetDescription>Choose how you want to import your {importType.toLowerCase()}s</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <Card className="bg-[#1A1A1A] border-[#2F2F2F]">
            <CardHeader>
              <CardTitle>Import CSV</CardTitle>
              <CardDescription>Upload a CSV file with your {importType.toLowerCase()} data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csv">CSV File</Label>
                <Input
                  id="csv"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="bg-[#121212] border-[#2F2F2F]"
                />
              </div>
              <Button
                className="mt-4 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white border-0"
                onClick={handleUpload}
                disabled={!file}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload CSV
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1A] border-[#2F2F2F]">
            <CardHeader>
              <CardTitle>Integrate</CardTitle>
              <CardDescription>
                Connect to a service to import {importType.toLowerCase()}s automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="integration">Select Integration</Label>
                <Select onValueChange={handleIntegrationChange}>
                  <SelectTrigger className="bg-[#121212] border-[#2F2F2F]">
                    <SelectValue placeholder="Select an integration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="zendesk">Zendesk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="mt-4 bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white border-0"
                onClick={handleIntegrate}
                disabled={!integration}
              >
                <Link className="mr-2 h-4 w-4" /> Connect and Import
              </Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}

