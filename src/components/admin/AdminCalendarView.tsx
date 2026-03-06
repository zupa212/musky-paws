'use client'

import { useState, useMemo } from 'react'
import {
    format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO,
    setHours, setMinutes, isBefore, startOfToday,
} from 'date-fns'
import { el } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar } from 'lucide-react'

// Define working hours for the calendar grid
const START_HOUR = 9  // 09:00
const END_HOUR = 21   // 21:00

interface AdminCalendarViewProps {
    bookings: any[]
    gcalEvents?: { start: string; end: string; summary?: string }[]
    onAddBooking: (date: string, time: string) => void
    onBookingClick: (booking: any) => void
}

export default function AdminCalendarView({ bookings, gcalEvents = [], onAddBooking, onBookingClick }: AdminCalendarViewProps) {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 })) // Monday

    // Generate week days
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i))
    }, [currentWeekStart])

    // Generate time slots (every 30 mins)
    const timeSlots = useMemo(() => {
        const slots = []
        for (let h = START_HOUR; h < END_HOUR; h++) {
            slots.push(`${h.toString().padStart(2, '0')}:00`)
            slots.push(`${h.toString().padStart(2, '0')}:30`)
        }
        return slots
    }, [])

    const today = startOfToday()

    // Status styling mapping
    const STATUS_COLORS: Record<string, string> = {
        pending: 'bg-yellow-100 border-yellow-300 text-yellow-800 border-l-4 border-l-yellow-500',
        confirmed: 'bg-green-100 border-green-300 text-green-800 border-l-4 border-l-green-500',
        completed: 'bg-blue-100 border-blue-300 text-blue-800 border-l-4 border-l-blue-500',
        canceled: 'bg-red-100 border-red-300 text-red-800 border-l-4 border-l-red-500 opacity-60',
        no_show: 'bg-gray-100 border-gray-300 text-gray-700 border-l-4 border-l-gray-500 opacity-60',
    }

    return (
        <div className="bg-white rounded-2xl border border-brand-200 overflow-hidden flex flex-col h-[600px] md:h-[800px] select-none">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-100 bg-brand-50">
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-brand-200" title="Προηγούμενη εβδομάδα">
                        <ChevronLeft className="w-5 h-5 text-brand-600" />
                    </button>
                    <button onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} className="px-3 py-1.5 text-sm font-bold text-brand-700 hover:bg-white rounded-xl transition-colors border border-brand-200 bg-white" title="Πήγαινε στο σήμερα">
                        Σήμερα
                    </button>
                    <button onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-brand-200" title="Επόμενη εβδομάδα">
                        <ChevronRight className="w-5 h-5 text-brand-600" />
                    </button>
                </div>
                <h2 className="text-lg font-bold text-brand-900 capitalize">
                    {format(weekDays[0], 'MMMM', { locale: el })} {format(weekDays[0], 'yyyy')}
                </h2>
                <div className="w-20" /> {/* Balancer */}
            </div>

            {/* Calendar Body (Scrollable) */}
            <div className="flex-1 overflow-auto bg-white custom-scrollbar flex relative">

                {/* Time Axis (Left static column) */}
                <div className="w-16 shrink-0 border-r border-brand-100 bg-brand-50/30 sticky left-0 z-20">
                    <div className="h-14 border-b border-brand-100 bg-brand-50 sticky top-0 z-30 flex items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-brand-400">Ώρα</span>
                    </div>
                    {timeSlots.map(time => {
                        const isOClock = time.endsWith(':00')
                        return (
                            <div key={time} className={`h-12 border-b border-brand-100 flex items-start justify-center pt-1 ${isOClock ? 'bg-brand-50/50 text-brand-600' : 'text-brand-300'}`}>
                                <span className="text-xs font-semibold">{isOClock ? time : ''}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Days Columns (X) */}
                <div className="flex-1 flex min-w-[700px] relative">
                    {weekDays.map(day => {
                        const isTodayMarker = isSameDay(day, new Date())
                        const isPastDay = isBefore(day, today)

                        return (
                            <div key={day.toISOString()} className="flex-1 min-w-[120px] border-r border-brand-100 flex flex-col relative group/col">

                                {/* Header for the specific day */}
                                <div className={`h-14 border-b border-brand-100 flex flex-col items-center justify-center sticky top-0 z-10 transition-colors
                                    ${isTodayMarker ? 'bg-accent-50 border-b-accent-200' : 'bg-brand-50'}`}>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isTodayMarker ? 'text-accent-600' : 'text-brand-500'}`}>
                                        {format(day, 'EEEE', { locale: el })}
                                    </span>
                                    <span className={`text-lg leading-tight font-extrabold ${isTodayMarker ? 'text-accent-700' : 'text-brand-900'}`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                {/* Background slots & Grid Lines */}
                                {timeSlots.map(time => {
                                    const [hours, mins] = time.split(':').map(Number)
                                    const slotDate = setMinutes(setHours(day, hours), mins)
                                    const slotDateStr = format(day, 'yyyy-MM-dd')
                                    const isPastSlot = isBefore(slotDate, new Date()) && !isSameDay(day, new Date())

                                    return (
                                        <div
                                            key={`${day.toISOString()}-${time}`}
                                            className={`h-12 border-b border-brand-50 relative group/cell transition-colors
                                                ${time.endsWith(':00') ? 'border-t border-t-brand-100' : ''}
                                                ${isPastSlot ? 'bg-brand-50/30' : 'hover:bg-accent-50 cursor-pointer'}
                                            `}
                                            onClick={() => {
                                                if (!isPastSlot) onAddBooking(slotDateStr, time)
                                            }}
                                        >
                                            {/* Hover plus visible only when empty cell hovered */}
                                            {!isPastSlot && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 pointer-events-none transition-opacity">
                                                    <span className="text-[10px] font-bold text-accent-600 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                                                        + Προσθήκη
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                {/* Render Absolute Overlay Bookings for this day */}
                                {bookings
                                    .filter(b => isSameDay(parseISO(b.start_at), day))
                                    .map(b => {
                                        const bStart = parseISO(b.start_at)
                                        const startHourIdx = timeSlots.indexOf(format(bStart, 'HH:mm'))
                                        if (startHourIdx === -1) return null // Out of displayed hours

                                        const duration = b.services?.duration_min || 30
                                        const slotCount = Math.max(1, Math.ceil(duration / 30))
                                        const colorCls = STATUS_COLORS[b.status] || STATUS_COLORS.pending

                                        // Calculate absolute positioning based on 12px height grid cells
                                        const topOffset = startHourIdx * 48 // 48px is h-12
                                        const heightPixel = (slotCount * 48) - 4 // minus 4 for margin

                                        return (
                                            <div
                                                key={b.id}
                                                onClick={(e) => {
                                                    e.stopPropagation() // Prevent triggering new cell creation
                                                    onBookingClick(b)
                                                }}
                                                className={`absolute left-1 right-1 z-10 rounded-lg shadow-sm border p-1.5 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-md hover:z-20 cursor-pointer flex flex-col justify-start ${colorCls}`}
                                                style={{
                                                    top: topOffset + 2,
                                                    height: heightPixel,
                                                    minHeight: 44
                                                }}
                                            >
                                                <div className="text-[11px] font-extrabold leading-tight text-gray-900 truncate">
                                                    {b.customers?.name || 'Άγνωστος'}
                                                </div>
                                                <div className="text-[10px] font-medium leading-tight text-gray-700 truncate mt-0.5">
                                                    {b.services?.name}
                                                </div>
                                                {slotCount > 1 && b.pet_type && (
                                                    <div className="text-[10px] font-medium leading-tight text-gray-600 truncate mt-0.5 flex items-center gap-1">
                                                        {b.pet_type === 'dog' ? '🐶' : '🐱'} {b.breed ? b.breed : ''}
                                                    </div>
                                                )}

                                                {/* Status icon helper */}
                                                {b.status === 'confirmed' && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 absolute bottom-1.5 right-1.5 text-green-600 opacity-60" />
                                                )}
                                                {b.google_calendar_event_id && (
                                                    <span className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] font-bold px-1 rounded uppercase shadow-sm">
                                                        G
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}

                                {/* Render Absolute Overlay GCal Events for this day */}
                                {gcalEvents
                                    .filter(e => isSameDay(parseISO(e.start), day))
                                    .map((e, idx) => {
                                        const start = parseISO(e.start)
                                        let end = e.end.length === 10 ? addDays(parseISO(e.end), 1) : parseISO(e.end)

                                        // Bound to grid hours
                                        const gridStart = setMinutes(setHours(day, START_HOUR), 0)
                                        const gridEnd = setMinutes(setHours(day, END_HOUR), 0)

                                        const actualStart = isBefore(start, gridStart) ? gridStart : start
                                        const actualEnd = isBefore(gridEnd, end) ? gridEnd : end

                                        if (isBefore(actualEnd, actualStart)) return null

                                        // Find start slot index
                                        const startHour = actualStart.getHours()
                                        const startMin = actualStart.getMinutes()
                                        const startIdx = (startHour - START_HOUR) * 2 + (startMin >= 30 ? 1 : 0)

                                        const durationMins = (actualEnd.getTime() - actualStart.getTime()) / (1000 * 60)
                                        const slotCount = Math.max(0.5, durationMins / 30)

                                        const topOffset = startIdx * 48
                                        const heightPixel = (slotCount * 48) - 2

                                        return (
                                            <div
                                                key={`gcal-${idx}`}
                                                className="absolute left-1 right-1 z-5 rounded-lg border-2 border-dashed border-brand-300 bg-brand-50/80 text-brand-500 overflow-hidden select-none pointer-events-none p-1.5 flex flex-col justify-start"
                                                style={{
                                                    top: topOffset + 1,
                                                    height: heightPixel,
                                                    minHeight: 24,
                                                    opacity: 0.7
                                                }}
                                            >
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    <span className="text-[9px] font-bold uppercase tracking-tighter">Google Calendar</span>
                                                    <span className="text-[9px] font-bold ml-auto">{format(start, 'HH:mm')}</span>
                                                </div>
                                                <div className="text-[10px] font-bold leading-tight truncate">
                                                    {e.summary || 'Εξωτερικό Συμβάν'}
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
