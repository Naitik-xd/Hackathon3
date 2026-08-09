import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO, startOfWeek, endOfWeek } from 'date-fns'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import EventCard from '../components/EventCard'
import { supabase } from '../lib/supabase'

const CATEGORY_COLORS: Record<string, string> = {
  'Competition': '#3b82f6', 
  'Cultural': '#a855f7',    
  'Tech': '#64748b',        
  'Sports': '#10b981',      
  'Food': '#ef4444',        
  'Music': '#6366f1',       
}

const CATEGORY_BG_CLASSES: Record<string, string> = {
  'Competition': 'bg-primary-container',
  'Cultural': 'bg-tertiary-container',
  'Tech': 'bg-surface-dim',
  'Sports': 'bg-secondary-container',
  'Food': 'bg-error-container',
  'Music': 'bg-primary-fixed',
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    setLoading(true)
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', monthStart.toISOString())
      .lte('date', monthEnd.toISOString())

    if (error) {
      console.error(error)
    } else if (data) {
      const formatted = data.map(evt => ({
        id: evt.id,
        title: evt.title,
        category: evt.category,
        location: evt.city,
        time: evt.date ? format(parseISO(evt.date), 'EEE, MMM d, h:mm a') : 'TBA',
        rawDate: evt.date ? parseISO(evt.date) : null,
        rsvpCount: evt.rsvp_count?.toString() || '0',
        emoji: evt.theme_emoji || '🎪',
        bgClass: CATEGORY_BG_CLASSES[evt.category] || 'bg-surface-variant',
        isLive: evt.date ? isToday(parseISO(evt.date)) : false
      }))
      setEvents(formatted)
    }
    setLoading(false)
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }) 
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventsForDay = (day: Date) => {
    return events.filter(evt => evt.rawDate && isSameDay(evt.rawDate, day))
  }

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    setMobilePanelOpen(true)
  }

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : []

  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-[100px] md:pb-lg flex flex-col md:flex-row gap-lg mt-4">
          
          {/* Calendar Grid Section */}
          <div className={`flex-1 bg-surface-container-lowest border border-surface-variant rounded-2xl p-4 md:p-6 shadow-[0px_10px_40px_rgba(17,24,39,0.05)] h-fit transition-all duration-300 ${selectedDate ? 'md:w-2/3' : 'w-full'}`}>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
              {weekDays.map(day => (
                <div key={day} className="font-label-md text-label-md text-outline font-semibold uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, i) => {
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isTodayDate = isToday(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const dayEvents = getEventsForDay(day)

                return (
                  <button 
                    key={i} 
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square flex flex-col items-center justify-start p-1 md:p-2 rounded-xl border transition-all ${
                      !isCurrentMonth ? 'opacity-30 pointer-events-none border-transparent' : 
                      isSelected ? 'bg-primary/10 border-primary shadow-sm' : 
                      isTodayDate ? 'bg-secondary/10 border-secondary' : 
                      'bg-surface hover:bg-surface-variant border-surface-variant'
                    }`}
                  >
                    <span className={`font-body-md text-body-md md:text-lg md:font-bold mb-1 ${
                      isSelected ? 'text-primary' : isTodayDate ? 'text-secondary' : 'text-on-surface'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    <div className="flex flex-wrap justify-center gap-1 mt-auto">
                      {dayEvents.slice(0, 3).map((evt, idx) => (
                        <div 
                          key={idx} 
                          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" 
                          style={{ backgroundColor: CATEGORY_COLORS[evt.category] || '#94a3b8' }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-outline-variant flex items-center justify-center">
                          <span className="text-[8px] md:text-[10px] text-white leading-none">+</span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Desktop Side Panel */}
          {selectedDate && (
            <div className="hidden md:block w-1/3 bg-surface border border-surface-variant rounded-2xl p-6 shadow-sm h-fit sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <CalendarIcon size={20} className="text-primary" />
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map(evt => (
                    <EventCard key={evt.id} event={evt} />
                  ))
                ) : (
                  <div className="text-center py-10 text-on-surface-variant">
                    <div className="text-4xl mb-2">🍃</div>
                    <p>No events scheduled for this day.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Bottom Sheet */}
          <AnimatePresence>
            {mobilePanelOpen && selectedDate && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobilePanelOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                />
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 h-[70vh] bg-surface rounded-t-3xl z-50 md:hidden flex flex-col shadow-2xl"
                >
                  <div className="p-4 border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest rounded-t-3xl sticky top-0 z-10">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {format(selectedDate, 'MMM d, yyyy')}
                    </h3>
                    <button onClick={() => setMobilePanelOpen(false)} className="p-2 bg-surface-variant rounded-full text-on-surface">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-surface pb-24">
                    {selectedDayEvents.length > 0 ? (
                      selectedDayEvents.map(evt => (
                        <EventCard key={evt.id} event={evt} />
                      ))
                    ) : (
                      <div className="text-center py-20 text-on-surface-variant">
                        <div className="text-5xl mb-4">🍃</div>
                        <p className="font-body-lg">No events on this day.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </Layout>
    </PageTransition>
  )
}
