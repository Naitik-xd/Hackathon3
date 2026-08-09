import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import QRCode from 'qrcode'
import { format, parseISO } from 'date-fns'

const CATEGORY_COLORS: Record<string, string> = {
  'Competition': '#3b82f6', // blue
  'Cultural': '#a855f7',    // purple
  'Tech': '#64748b',        // slate
  'Sports': '#10b981',      // emerald
  'Food': '#ef4444',        // red
  'Music': '#6366f1',       // indigo
}

const CATEGORY_BG_CLASSES: Record<string, string> = {
  'Competition': 'bg-primary-container',
  'Cultural': 'bg-tertiary-container',
  'Tech': 'bg-surface-dim',
  'Sports': 'bg-secondary-container',
  'Food': 'bg-error-container',
  'Music': 'bg-primary-fixed',
}

interface TicketProps {
  id: string
  event_id: string
  title: string
  category: string
  city: string
  date: string
  emoji: string
  userId: string
  locationLat?: number
  locationLng?: number
}

function TicketCard({ ticket }: { ticket: TicketProps }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(`https://stagemap.vercel.app/ticket-verify/${ticket.event_id}/${ticket.userId}`)
        setQrCodeUrl(url)
      } catch (err) {
        console.error(err)
      }
    }
    generateQR()
  }, [ticket.event_id, ticket.userId])

  const colorHex = CATEGORY_COLORS[ticket.category] || '#94a3b8'
  const bgClass = CATEGORY_BG_CLASSES[ticket.category] || 'bg-surface-variant'
  const formattedDate = ticket.date ? format(parseISO(ticket.date), 'EEE, MMM d, yyyy • h:mm a') : 'TBA'

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative bg-white rounded-2xl shadow-[0px_10px_30px_rgba(17,24,39,0.1)] overflow-hidden flex flex-col md:flex-row mb-8 border-l-4"
      style={{ borderLeftColor: colorHex }}
    >
      {/* Top / Left Section (Emoji & Gradient) */}
      <div className={`md:w-1/3 p-6 ${bgClass} flex items-center justify-center relative min-h-[160px] md:min-h-full`}>
        <span className="text-7xl drop-shadow-md relative z-10">{ticket.emoji}</span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: colorHex }}>
            {ticket.category} Event
          </span>
          <h2 className="font-headline-md text-headline-md-mobile md:text-headline-md font-bold text-gray-900 leading-tight">
            {ticket.title}
          </h2>
          <div className="text-gray-500 font-body-md mt-2 flex flex-col gap-1">
            <p>📍 {ticket.city}</p>
            <p>🕒 {formattedDate}</p>
          </div>
          {ticket.locationLat && ticket.locationLng && (
            <button 
              onClick={() => window.open(`https://www.openstreetmap.org/directions?to=${ticket.locationLat},${ticket.locationLng}`, '_blank')}
              className="mt-3 self-start text-[#7C3AED] hover:bg-[#7C3AED]/10 text-sm font-semibold px-3 py-1.5 rounded-full border border-[#7C3AED]/20 transition-colors flex items-center gap-1"
            >
              🗺️ Get Directions
            </button>
          )}
        </div>

        {/* Divider & Bottom Section */}
        <div className="mt-8 relative">
          {/* Dashed Divider with Cutouts */}
          <div className="absolute left-[-32px] md:left-[-40px] right-[-32px] md:right-[-40px] top-0 border-t-2 border-dashed border-gray-200"></div>
          
          {/* Circular cutouts */}
          <div className="absolute left-[-40px] md:left-[-48px] top-[-10px] w-5 h-5 bg-[#F9FAFB] rounded-full shadow-inner"></div>
          <div className="absolute right-[-40px] md:right-[-48px] top-[-10px] w-5 h-5 bg-[#F9FAFB] rounded-full shadow-inner"></div>

          <div className="pt-6 flex justify-between items-end">
            <div>
              <p className="text-gray-400 font-label-md uppercase tracking-wider text-xs">Admit One</p>
              <p className="font-headline-sm text-gray-900 mt-1">Entry Pass</p>
            </div>
            
            <div className="flex flex-col items-center">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20 md:w-24 md:h-24 rounded-md border border-gray-100 p-1" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-md animate-pulse"></div>
              )}
              <span className="text-[10px] text-gray-400 mt-2">Scan at venue</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function MyTickets() {
  const [tickets, setTickets] = useState<TicketProps[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    
    setUserId(user.id)

    // Join rsvp with events
    const { data, error } = await supabase
      .from('rsvp')
      .select(`
        id,
        event_id,
        events (
          title, category, city, date, theme_emoji, location_lat, location_lng
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error(error)
    } else if (data) {
      const formatted = data.map((rsvp: any) => {
        const ev = rsvp.events;
        return {
          id: rsvp.id,
          event_id: rsvp.event_id,
          title: ev?.title || 'Unknown Event',
          category: ev?.category || 'Music',
          city: ev?.city || 'Unknown Location',
          date: ev?.date,
          emoji: ev?.theme_emoji || '🎫',
          userId: user.id,
          locationLat: ev?.location_lat,
          locationLng: ev?.location_lng
        }
      })
      setTickets(formatted)
    }
    
    setLoading(false)
  }

  return (
    <PageTransition>
      <Layout>
        <div className="flex-1 w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-[100px] bg-[#F9FAFB] min-h-screen">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-gray-900 mb-8 pt-8">
            My Tickets 🎟️
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : tickets.length > 0 ? (
            <div className="flex flex-col gap-4">
              {tickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-md text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-[80px] md:text-[120px] drop-shadow-sm mb-4"
              >
                🎫
              </motion.div>
              <h2 className="font-headline-md text-headline-md-mobile md:text-headline-md text-gray-900">
                No Tickets Found
              </h2>
              <p className="font-body-lg text-body-lg text-gray-500 max-w-md">
                You haven't RSVP'd to any events yet. Head over to Discover to find your next experience!
              </p>
            </div>
          )}
        </div>
      </Layout>
    </PageTransition>
  )
}
