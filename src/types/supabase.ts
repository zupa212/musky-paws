export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            bookings: {
                Row: {
                    breed: string | null
                    created_at: string | null
                    customer_id: string
                    end_at: string
                    id: string
                    notes: string | null
                    pet_type: string
                    service_id: string
                    source: string | null
                    staff_id: string | null
                    start_at: string
                    status: string
                    updated_at: string | null
                    weight_kg: string | null
                }
                Insert: {
                    breed?: string | null
                    created_at?: string | null
                    customer_id: string
                    end_at: string
                    id?: string
                    notes?: string | null
                    pet_type: string
                    service_id: string
                    source?: string | null
                    staff_id?: string | null
                    start_at: string
                    status?: string
                    updated_at?: string | null
                    weight_kg?: string | null
                }
                Update: {
                    breed?: string | null
                    created_at?: string | null
                    customer_id?: string
                    end_at?: string
                    id?: string
                    notes?: string | null
                    pet_type?: string
                    service_id?: string
                    source?: string | null
                    staff_id?: string | null
                    start_at?: string
                    status?: string
                    updated_at?: string | null
                    weight_kg?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "bookings_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "customers"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "bookings_service_id_fkey"
                        columns: ["service_id"]
                        isOneToOne: false
                        referencedRelation: "services"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "bookings_staff_id_fkey"
                        columns: ["staff_id"]
                        isOneToOne: false
                        referencedRelation: "staff"
                        referencedColumns: ["id"]
                    },
                ]
            }
            customers: {
                Row: {
                    created_at: string | null
                    email: string | null
                    id: string
                    name: string
                    phone: string
                }
                Insert: {
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name: string
                    phone: string
                }
                Update: {
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name?: string
                    phone?: string
                }
                Relationships: []
            }
            notification_outbox: {
                Row: {
                    attempts: number
                    booking_id: string
                    channel: string
                    created_at: string | null
                    id: string
                    last_error: string | null
                    payload: Json
                    provider_message_id: string | null
                    run_at: string
                    status: string
                    template: string
                    to: string
                    updated_at: string | null
                }
                Insert: {
                    attempts?: number
                    booking_id: string
                    channel: string
                    created_at?: string | null
                    id?: string
                    last_error?: string | null
                    payload?: Json
                    provider_message_id?: string | null
                    run_at?: string
                    status?: string
                    template: string
                    to: string
                    updated_at?: string | null
                }
                Update: {
                    attempts?: number
                    booking_id?: string
                    channel?: string
                    created_at?: string | null
                    id?: string
                    last_error?: string | null
                    payload?: Json
                    provider_message_id?: string | null
                    run_at?: string
                    status?: string
                    template?: string
                    to?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "notification_outbox_booking_id_fkey"
                        columns: ["booking_id"]
                        isOneToOne: false
                        referencedRelation: "bookings"
                        referencedColumns: ["id"]
                    },
                ]
            }
            schedule_exceptions: {
                Row: {
                    created_at: string | null
                    date: string
                    end_time: string | null
                    id: string
                    is_closed: boolean | null
                    notes: string | null
                    start_time: string | null
                }
                Insert: {
                    created_at?: string | null
                    date: string
                    end_time?: string | null
                    id?: string
                    is_closed?: boolean | null
                    notes?: string | null
                    start_time?: string | null
                }
                Update: {
                    created_at?: string | null
                    date?: string
                    end_time?: string | null
                    id?: string
                    is_closed?: boolean | null
                    notes?: string | null
                    start_time?: string | null
                }
                Relationships: []
            }
            schedules: {
                Row: {
                    breaks: Json | null
                    created_at: string | null
                    day_of_week: number
                    end_time: string
                    id: string
                    staff_id: string | null
                    start_time: string
                }
                Insert: {
                    breaks?: Json | null
                    created_at?: string | null
                    day_of_week: number
                    end_time: string
                    id?: string
                    staff_id?: string | null
                    start_time: string
                }
                Update: {
                    breaks?: Json | null
                    created_at?: string | null
                    day_of_week?: number
                    end_time?: string
                    id?: string
                    staff_id?: string | null
                    start_time?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "schedules_staff_id_fkey"
                        columns: ["staff_id"]
                        isOneToOne: false
                        referencedRelation: "staff"
                        referencedColumns: ["id"]
                    },
                ]
            }
            services: {
                Row: {
                    active: boolean | null
                    buffer_min: number
                    created_at: string | null
                    description: string | null
                    duration_min: number
                    id: string
                    name: string
                    price_from: number
                    slug: string
                }
                Insert: {
                    active?: boolean | null
                    buffer_min?: number
                    created_at?: string | null
                    description?: string | null
                    duration_min?: number
                    id?: string
                    name: string
                    price_from?: number
                    slug: string
                }
                Update: {
                    active?: boolean | null
                    buffer_min?: number
                    created_at?: string | null
                    description?: string | null
                    duration_min?: number
                    id?: string
                    name?: string
                    price_from?: number
                    slug?: string
                }
                Relationships: []
            }
            staff: {
                Row: {
                    active: boolean | null
                    created_at: string | null
                    email: string | null
                    id: string
                    name: string
                }
                Insert: {
                    active?: boolean | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name: string
                }
                Update: {
                    active?: boolean | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name?: string
                }
                Relationships: []
            }
        }
    }
}
