import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import EventCard from '../components/EventCard'
import { supabase } from '../lib/supabase'
import { isToday, parseISO } from 'date-fns'

const CATEGORY_COLORS: Record<string, string> = {
  'Competition': 'bg-primary-container',
  'Cultural': 'bg-tertiary-container',
  'Tech': 'bg-surface-dim',
  'Sports': 'bg-secondary-container',
  'Food': 'bg-error-container',
  'Music': 'bg-primary-fixed',
}

export default function SavedEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedEvents()
  }, [])

  const fetchSavedEvents = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('saved_events')
      .select(`
        event_id,
        events (*)
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error(error)
    } else if (data) {
      const formatted = data.map((saved: any) => {
        const evt = saved.events
        return {
          id: evt.id,
          title: evt.title,
          category: evt.category,
          location: evt.city,
          time: evt.date ? new Date(evt.date).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : 'TBA',
          rawDate: evt.date,
          rsvpCount: evt.rsvp_count?.toString() || '0',
          emoji: evt.theme_emoji || '🎪',
          bgClass: CATEGORY_COLORS[evt.category] || 'bg-surface-variant',
          isLive: evt.date ? isToday(parseISO(evt.date)) : false
        }
      })
      setEvents(formatted)
    }
    setLoading(false)
  }

  return (
    <PageTransition>
      <Layout>
        <div className="flex-1 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-[100px]">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8">
            Saved Events
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : events.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-md text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-[80px] md:text-[120px] drop-shadow-sm mb-4"
              >
                📌
              </motion.div>
              <h2 className="font-headline-md text-headline-md-mobile md:text-headline-md text-on-surface">
                No Saved Events
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Your saved events will appear here. Start exploring and bookmarking the ones you love!
              </p>
            </div>
          )}
        </div>
      </Layout>
    </PageTransition>
  )
}
