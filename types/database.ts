export interface Database {
  public: {
    Tables: {
      webhook_events: {
        Row: {
          id: string
          type: string | null
          status: string | null
          timestamp: string
          response_time: number | null
          payload_size: number | null
          attribution: string | null
          created: string
          invoice: string | null
          currency: string | null
          customer: string | null
          livemode: boolean | null
          metadata: any | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_address_city: string | null
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_address_state: string | null
          shipping_address_country: string | null
          shipping_address_postal_code: string | null
          client_secret: string | null
          latest_charge: string | null
          amount_received: number | null
          amount_capturable: number | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          amount_paid: number | null
          capture_method: string | null
          payment_method: string | null
          payment_method_types: any | null
          statement_descriptor: string | null
          created_at: string
          updated_at: string
          payload: any | null
        }
        Insert: {
          id?: string
          type?: string | null
          status?: string | null
          timestamp?: string
          response_time?: number | null
          payload_size?: number | null
          attribution?: string | null
          created?: string
          invoice?: string | null
          currency?: string | null
          customer?: string | null
          livemode?: boolean | null
          metadata?: any | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_address_city?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_address_state?: string | null
          shipping_address_country?: string | null
          shipping_address_postal_code?: string | null
          client_secret?: string | null
          latest_charge?: string | null
          amount_received?: number | null
          amount_capturable?: number | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          amount_paid?: number | null
          capture_method?: string | null
          payment_method?: string | null
          payment_method_types?: any | null
          statement_descriptor?: string | null
          created_at?: string
          updated_at?: string
          payload?: any | null
        }
        Update: {
          id?: string
          type?: string | null
          status?: string | null
          timestamp?: string
          response_time?: number | null
          payload_size?: number | null
          attribution?: string | null
          created?: string
          invoice?: string | null
          currency?: string | null
          customer?: string | null
          livemode?: boolean | null
          metadata?: any | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_address_city?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_address_state?: string | null
          shipping_address_country?: string | null
          shipping_address_postal_code?: string | null
          client_secret?: string | null
          latest_charge?: string | null
          amount_received?: number | null
          amount_capturable?: number | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          amount_paid?: number | null
          capture_method?: string | null
          payment_method?: string | null
          payment_method_types?: any | null
          statement_descriptor?: string | null
          created_at?: string
          updated_at?: string
          payload?: any | null
        }
      }
    }
  }
}
