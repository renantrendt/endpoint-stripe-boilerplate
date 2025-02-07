import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

const integrations = [
  {
    name: "Google",
    fields: [
      { key: "GOOGLE_CLIENT_ID", label: "Client ID" },
      { key: "GOOGLE_CLIENT_SECRET", label: "Client Secret" },
    ],
    docsUrl: "https://developers.google.com/identity/protocols/oauth2",
    hint: "Found in Google Cloud Console",
  },
  {
    name: "Claude AI",
    fields: [{ key: "CLAUDE_API_KEY", label: "API Key" }],
    docsUrl: "https://www.anthropic.com/product",
    hint: "Available in Claude AI dashboard",
  },
  {
    name: "Wordware",
    fields: [{ key: "WORDWARE_API_KEY", label: "API Key" }],
    docsUrl: "https://docs.wordware.ai/",
    hint: "Found in Wordware account settings",
  },
  {
    name: "Zendesk",
    fields: [
      { key: "ZENDESK_API_TOKEN", label: "API Token" },
      { key: "ZENDESK_SUBDOMAIN", label: "Subdomain" },
    ],
    docsUrl: "https://developer.zendesk.com/api-reference/",
    hint: "Available in Zendesk Admin Center",
  },
  {
    name: "HubSpot",
    fields: [{ key: "HUBSPOT_API_KEY", label: "API Key" }],
    docsUrl: "https://developers.hubspot.com/",
    hint: "Found in HubSpot Developer portal",
  },
  {
    name: "Salesforce",
    fields: [
      { key: "SALESFORCE_CLIENT_ID", label: "Client ID" },
      { key: "SALESFORCE_CLIENT_SECRET", label: "Client Secret" },
    ],
    docsUrl: "https://developer.salesforce.com/docs/",
    hint: "Available in Salesforce App Manager",
  },
  {
    name: "Calendly",
    fields: [{ key: "CALENDLY_API_KEY", label: "API Key" }],
    docsUrl: "https://developer.calendly.com/",
    hint: "Found in Calendly account settings",
  },
]

export function IntegrationsForm() {
  const [settings, setSettings] = React.useState({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Settings submitted:", settings)
    // Here you would typically send these settings to your backend
  }

  return (
    <form onSubmit={handleSubmit}>
      {integrations.map((integration) => (
        <Card key={integration.name} className="mb-6">
          <CardHeader>
            <CardTitle>{integration.name} Integration</CardTitle>
            <CardDescription>Configure your {integration.name} integration settings</CardDescription>
          </CardHeader>
          <CardContent>
            {integration.fields.map((field) => (
              <div key={field.key} className="mb-4">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input id={field.key} name={field.key} onChange={handleChange} value={settings[field.key] || ""} />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <a
              href={integration.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              View {integration.name} Documentation
            </a>
          </CardFooter>
        </Card>
      ))}
      <Button type="submit">Save Settings</Button>
    </form>
  )
}

