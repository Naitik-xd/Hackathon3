import { useState, ChangeEvent, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Verified, Users, Calendar, MapPin, Bookmark } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { format, parseISO } from 'date-fns'

const customIcon = new L.DivIcon({
  html: `<div style="font-size: 24px;">📍</div>`,
  className: 'custom-venue-pin',
  iconSize: [24, 24],
  iconAnchor: [12, 24]
})


export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isRsvpd, setIsRsvpd] = useState(false)
  const [rsvpCount, setRsvpCount] = useState(248) // Default to 248 as in the mockup, ideally fetch from DB
  const [guestCount, setGuestCount] = useState(1)
  const [rsvpLoading, setRsvpLoading] = useState(false)

  const [isSaved, setIsSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  
  const [eventDetails, setEventDetails] = useState<any>(null)

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!id) return

      // Fetch full event
      const { data: eventData } = await supabase.from('events').select('*').eq('id', id).maybeSingle()
      if (eventData) {
        setEventDetails(eventData)
        setGuestCount(eventData.guest_count || 1)
        if (eventData.rsvp_count !== undefined) setRsvpCount(eventData.rsvp_count)
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: rsvpData } = await supabase
        .from('rsvp')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (rsvpData) setIsRsvpd(true)

      const { data: savedData } = await supabase
        .from('saved_events')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (savedData) setIsSaved(true)
    }
    checkUserStatus()
  }, [id])

  const handleRsvp = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast('Sign in to RSVP', { icon: '👤' })
      navigate('/auth', { state: { from: location } })
      return
    }

    setRsvpLoading(true)

    try {
      // Check if already RSVP'd
      const { data: existing, error: checkError } = await supabase
        .from('rsvp')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (checkError) {
        console.error('RSVP check error:', checkError)
        toast.error(checkError.message)
        return
      }

      if (existing) {
        toast("Already RSVP'd!", { icon: '✅' })
        setIsRsvpd(true)
        return
      }

      // Insert RSVP
      const { error: insertError } = await supabase
        .from('rsvp')
        .insert([{ event_id: id, user_id: user.id }])

      if (insertError) {
        console.error('RSVP insert error:', insertError)
        toast.error(insertError.message)
        return
      }

      // Increment rsvp_count on events table
      const { error: updateError } = await supabase
        .from('events')
        .update({ rsvp_count: rsvpCount + 1 })
        .eq('id', id)

      if (updateError) {
        console.error('RSVP count update error:', updateError)
      }

      setIsRsvpd(true)
      setRsvpCount(prev => prev + 1)
      toast.success('🎉 You are in! RSVP confirmed')

    } finally {
      setRsvpLoading(false)
    }
  }

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast('Sign in to save events', { icon: '🔖' })
      return
    }

    setSaveLoading(true)
    if (isSaved) {
      await supabase.from('saved_events').delete().eq('event_id', id).eq('user_id', user.id)
      setIsSaved(false)
      toast('Removed from saved', { icon: '🗑️' })
    } else {
      await supabase.from('saved_events').insert({ event_id: id, user_id: user.id })
      setIsSaved(true)
      toast.success('Event saved!')
    }
    setSaveLoading(false)
  }

  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow content-canvas pb-24 md:pb-0 relative">
          {/* Hero Banner (Emoji Focus) */}
          <section className="w-full relative h-[300px] md:h-[400px] bg-gradient-to-br from-tertiary-fixed to-primary-fixed flex items-center justify-center overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 rounded-full blur-3xl transform rotate-12"></div>
            <div className="absolute bottom-[-30%] left-[-10%] w-[60%] h-[100%] bg-primary/10 rounded-full blur-3xl"></div>
            
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative z-10 text-[120px] md:text-[160px] drop-shadow-2xl"
            >
              {eventDetails?.theme_emoji || '🎤'}
            </motion.div>
            
            <div className="absolute top-margin-mobile left-margin-mobile md:hidden z-20">
              <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center shadow-sm text-on-surface">
                <ArrowLeft size={24} />
              </button>
            </div>
          </section>

          {/* Content Area */}
          <section className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop -mt-8 relative z-20">
            
            {/* Main Info Card */}
            <div className="bg-surface rounded-xl shadow-[0px_10px_30px_rgba(17,24,39,0.05)] border border-surface-variant p-lg md:p-xl mb-lg">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-md mb-md">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
                      Live
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      {eventDetails?.category || 'Category'}
                    </span>
                  </div>
                  <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
                    {eventDetails?.title || 'Loading...'}
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-2">
                    By <span className="font-bold text-primary">SoundScapes BLR</span>
                    <Verified className="text-primary" size={16} fill="currentColor" />
                  </p>
                </div>
                
                <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-row items-center gap-2 flex-shrink-0">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saveLoading}
                    className={`w-12 h-12 flex-shrink-0 rounded-xl shadow-sm border-2 flex items-center justify-center transition-colors ${
                      isSaved 
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white' 
                        : 'bg-white border-[#7C3AED] text-[#7C3AED]'
                    }`}
                  >
                    <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                  </motion.button>
                  
                  <motion.button 
                    whileTap={isRsvpd ? {} : { scale: 0.98 }}
                    onClick={handleRsvp}
                    disabled={isRsvpd || rsvpLoading}
                    className={`flex-grow md:w-auto h-12 font-headline-sm text-headline-sm px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-3 ${
                      isRsvpd 
                        ? 'bg-emerald-500 text-white cursor-not-allowed'
                        : 'bg-primary text-on-primary hover:bg-surface-tint'
                    }`}
                  >
                    {isRsvpd ? "✅ You're In!" : "RSVP Now"}
                    <span className="flex items-center gap-1 font-body-sm text-body-sm bg-black/20 px-2 py-1 rounded-md">
                      <Users size={14} /> {rsvpCount} going · up to {guestCount} guests per person
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Logistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-lg border-t border-surface-variant pt-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      {eventDetails?.date ? format(parseISO(eventDetails.date), 'EEEE, MMM d') : 'TBA'}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {eventDetails?.date ? format(parseISO(eventDetails.date), 'h:mm a') : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{eventDetails?.venue_name || eventDetails?.city || 'TBA'}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{eventDetails?.city || ''}</p>
                  </div>
                </div>
              </div>

              {eventDetails?.location_lat && eventDetails?.location_lng && (
                <div className="mt-8 border-t border-surface-variant pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline-sm text-on-surface">Location Map</h3>
                    <button 
                      onClick={() => window.open(`https://www.openstreetmap.org/directions?to=${eventDetails.location_lat},${eventDetails.location_lng}`, '_blank')}
                      className="flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] px-4 py-2 rounded-full hover:bg-surface-tint transition-colors text-sm font-semibold"
                    >
                      🗺️ Get Directions
                    </button>
                  </div>
                  <div className="w-full h-[250px] rounded-xl overflow-hidden border border-outline-variant relative z-0 mb-3">
                    <MapContainer 
                      center={[eventDetails.location_lat, eventDetails.location_lng]} 
                      zoom={15} 
                      className="w-full h-full"
                      zoomControl={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[eventDetails.location_lat, eventDetails.location_lng]} icon={customIcon} />
                    </MapContainer>
                  </div>
                  <p className="font-bold text-gray-900">{eventDetails.venue_name || 'Event Venue'}</p>
                  <p className="text-gray-500 text-sm">{eventDetails.city}</p>
                </div>
              )}
            </div>

            <div className="mb-xl mt-lg">
              <div className="bg-surface rounded-xl shadow-[0px_10px_30px_rgba(17,24,39,0.05)] border border-surface-variant p-lg flex flex-col justify-center">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Who's Going</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm border-2 border-surface shadow-sm z-10 relative">AK</div>
                  <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm border-2 border-surface shadow-sm z-20 -ml-4 relative">RJ</div>
                  <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-sm border-2 border-surface shadow-sm z-30 -ml-4 relative">SM</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant ml-4">Friends & locals attending</p>
                </div>
              </div>
            </div>

            <div className="mb-xl">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">About Event</h2>
              <div className="prose prose-sm md:prose-base max-w-none text-on-surface-variant">
                <p className="mb-4">{eventDetails?.description || 'Get ready for an electrifying night as we bring together the city\'s best.'}</p>
              </div>
            </div>

          </section>
        </div>
      </Layout>
    </PageTransition>
  )
}
