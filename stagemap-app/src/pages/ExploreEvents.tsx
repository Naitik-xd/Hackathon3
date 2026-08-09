import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Grid, Map } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import EventCard from '../components/EventCard'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
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

export default function ExploreEvents() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('filter') || 'All'
  
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [activeCity, setActiveCity] = useState<string>('All Cities')
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState<string[]>(['All Cities'])
  
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('events').select('*').eq('is_expired', false).lt('report_count', 7).order('date', { ascending: true })
    if (error) {
      console.error(error)
    } else if (data) {
      // Map to EventCard format
      const formatted = data.map(evt => ({
        id: evt.id,
        title: evt.title,
        category: evt.category,
        location: evt.city,
        time: evt.date ? new Date(evt.date).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : 'TBA',
        rawDate: evt.date,
        rsvpCount: evt.rsvp_count?.toString() || '0',
        emoji: evt.theme_emoji || '🎪',
        bgClass: CATEGORY_COLORS[evt.category] || 'bg-surface-variant',
        isLive: evt.date ? isToday(parseISO(evt.date)) : false,
        is_verified: evt.is_verified,
        reportCount: evt.report_count || 0
      }))
      setEvents(formatted)
      
      const uniqueCities = Array.from(new Set(data.map(d => d.city).filter(Boolean))) as string[]
      setCities(['All Cities', ...uniqueCities])
    }
    setLoading(false)
  }

  // Filtering
  const filteredEvents = events.filter(evt => {
    // Expiration filter
    if (evt.rawDate && new Date(evt.rawDate) <= new Date()) return false

    // City filter
    if (activeCity !== 'All Cities' && evt.location !== activeCity) return false
    
    // Category / Date filter
    if (activeCategory === 'Today') {
      if (!evt.rawDate || !isToday(parseISO(evt.rawDate))) return false
    } else if (activeCategory !== 'All') {
      if (evt.category !== activeCategory) return false
    }
    
    return true
  })

  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-[100px] md:pb-lg flex flex-col gap-lg mt-8">
          {/* Controls: Filters & View Toggle */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-sm">
              <div className="relative group">
                <button className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary-container/20 transition-all shadow-[0px_10px_30px_rgba(17,24,39,0.05)]">
                  <span className="font-body-sm text-body-sm text-on-surface font-medium whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis">
                    {activeCity}
                  </span>
                  <ChevronDown size={18} />
                </button>
                {/* City Dropdown */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-surface-variant rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => setActiveCity(city)}
                      className={`w-full text-left px-4 py-3 font-body-sm transition-colors hover:bg-surface-variant ${activeCity === city ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Chips */}
              {[
                { label: 'All', icon: '🌐' },
                { label: 'Today', icon: '🗓️' },
                { label: 'Music', icon: '🎵' },
                { label: 'Competition', icon: '🏆' },
                { label: 'Cultural', icon: '🎨' },
                { label: 'Tech', icon: '💻' },
                { label: 'Sports', icon: '⚽' },
                { label: 'Food', icon: '🍜' },
              ].map((chip) => (
                <motion.button 
                  key={chip.label}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(chip.label)}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 border shadow-[0px_10px_30px_rgba(17,24,39,0.05)] transition-colors ${
                    activeCategory === chip.label 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-on-surface border-outline-variant hover:bg-surface-container-highest'
                  }`}
                >
                  <span className="text-[16px]">{chip.icon}</span>
                  <span className="font-label-md text-label-md">{chip.label}</span>
                </motion.button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-outline-variant">
              <button className="flex items-center justify-center p-2 rounded-md bg-surface-container-lowest shadow-sm text-primary">
                <Grid size={20} />
              </button>
              <Link to="/map" className="flex items-center justify-center p-2 rounded-md text-on-surface-variant hover:text-primary transition-colors">
                <Map size={20} />
              </Link>
            </div>
          </section>

          {/* Events Grid / Empty State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="text-[80px]">🎭</div>
              <h2 className="font-headline-md text-headline-md text-on-surface">No events here yet</h2>
              <p className="font-body-md text-on-surface-variant">Be the first to post one!</p>
              <button 
                onClick={() => navigate('/post')}
                className="mt-4 px-6 py-3 rounded-full font-label-lg text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#FF7F50' }}
              >
                Post Event
              </button>
            </div>
          )}
        </div>
      </Layout>
    </PageTransition>
  )
}
