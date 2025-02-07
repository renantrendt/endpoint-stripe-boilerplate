"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WebhookEvent } from "@/types/webhook"

interface DetailsSidebarProps {
  isOpen: boolean
  onClose: () => void
  event: WebhookEvent | null
}

export function DetailsSidebar({ isOpen, onClose, event }: DetailsSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle className="flex items-center justify-between">
            Webhook Event Details
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] pr-4">
          {event && (
            <div className="space-y-6 pb-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Payment Status
                      </div>
                      <div className="mt-1">
                        <Badge variant={event.payment_status === 'succeeded' ? 'success' : 'destructive'}>
                          {event.payment_status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Amount
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: event.currency || 'USD'
                        }).format(event.amount / 100)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Customer Name
                      </div>
                      <div className="text-sm font-medium mt-1">{event.customer_name || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Customer Email
                      </div>
                      <div className="text-sm font-medium mt-1">{event.customer_email || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Customer Phone
                      </div>
                      <div className="text-sm font-medium mt-1">{event.customer_phone || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Date
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Full Payload</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-secondary p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                    {JSON.stringify(event.raw_payload, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
