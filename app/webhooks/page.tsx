"use client"

import { useState, useEffect } from "react"
import { WebhookEvent } from "@/types/webhook"
import { DetailsSidebar } from "@/components/details-sidebar"
import { WebhookTable } from "@/components/webhook-table"
import { supabase } from "@/lib/supabase"

export default function WebhooksPage() {
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null)
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching webhook events...')
        const { data, error } = await supabase
          .from('stripe_webhook_events')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }
        console.log('Received webhook events:', data?.length || 0, 'events')
        setEvents(data || [])
      } catch (error) {
        console.error('Error fetching webhook events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()

    // Subscribe to realtime updates
    const channel = supabase
      .channel('stripe-webhook-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stripe_webhook_events',
        },
        (payload) => {
          const newEvent = payload.new as WebhookEvent
          setEvents(prev => [newEvent, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex-1 flex-col space-y-4 p-4 md:p-8 flex">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webhook Events</h1>
          <p className="text-muted-foreground">
            Monitor and analyze incoming webhook events
          </p>
        </div>
      </div>

      <WebhookTable
        events={events}
        onEventSelect={setSelectedEvent}
      />

      <DetailsSidebar
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  )
}
