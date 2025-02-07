"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { X } from "lucide-react"
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
  console.log('DetailsSidebar render - isOpen:', isOpen, 'event:', event)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex justify-between items-center w-full pr-8">
              Webhook Event Details
              <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
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
                        Status
                      </div>
                      <div className="mt-1">
                        <Badge variant={event.status === 'succeeded' ? 'success' : 'destructive'}>
                          {event.status || 'pending'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Amount
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {event.amount_received ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: event.currency || 'USD'
                        }).format(event.amount_received / 100) : '-'}
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
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Shipping Name
                      </div>
                      <div className="text-sm font-medium mt-1">{event.shipping_name || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Shipping Phone
                      </div>
                      <div className="text-sm font-medium mt-1">{event.shipping_phone || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Shipping Address
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {event.shipping_address_line1 ? (
                          <>
                            {event.shipping_address_line1}<br />
                            {event.shipping_address_line2 && <>{event.shipping_address_line2}<br /></>}
                            {event.shipping_address_city}, {event.shipping_address_state} {event.shipping_address_postal_code}<br />
                            {event.shipping_address_country}
                          </>
                        ) : '-'}
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
                    {JSON.stringify(event.payload, null, 2)}
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
