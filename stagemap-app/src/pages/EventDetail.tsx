import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Verified, Calendar, MapPin, Bookmark, Trash2, Plus, Minus } from 'lucide-react'
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
  const [isOwner, setIsOwner] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false)

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!id) return

      // Fetch full event
      const { data: eventData } = await supabase.from('events').select('*').eq('id', id).maybeSingle()
      if (eventData) {
        setEventDetails(eventData)
        if (eventData.rsvp_count !== undefined) setRsvpCount(eventData.rsvp_count)
        
        if (eventData.date && new Date(eventData.date) < new Date()) {
          setIsExpired(true)
        }
      }

      const { data: { user } } = await supabase.auth.getUser()

      // Ownership Check
      const myPostedEvents = JSON.parse(localStorage.getItem('my_posted_events') || '[]')
      if (myPostedEvents.includes(id) || (user && eventData?.created_by === user.id)) {
        setIsOwner(true)
      }

      if (user) {
        if (user.email === 'naitik.270810@gmail.com') setIsAdmin(true)
      }
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

    setRsvpModalOpen(true)
  }

  const confirmRsvp = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setRsvpLoading(true)
    try {
      // Insert RSVP
      const { error: insertError } = await supabase
        .from('rsvp')
        .insert([{ event_id: id, user_id: user.id, guest_count: guestCount }])

      if (insertError) {
        console.error('RSVP insert error:', insertError)
        toast.error(insertError.message)
        return
      }

      // Increment rsvp_count on events table
      const { error: updateError } = await supabase
        .from('events')
        .update({ rsvp_count: rsvpCount + guestCount })
        .eq('id', id)

      if (updateError) {
        console.error('RSVP count update error:', updateError)
      }

      setIsRsvpd(true)
      setRsvpCount(prev => prev + guestCount)
      toast.success('🎉 You are in! RSVP confirmed')
      setRsvpModalOpen(false)

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

  const handleDelete = async () => {
    if (!id) return
    const confirmDelete = window.confirm("Are you sure you want to delete this event?")
    if (!confirmDelete) return

    setDeleting(true)
    const { error } = await supabase.from('events').delete().eq('id', id)
    setDeleting(false)

    if (error) {
      toast.error("Failed to delete event.")
      console.error(error)
    } else {
      toast.success("Event deleted.")
      navigate('/explore')
    }
  }

  const handleVerify = async () => {
    const { error } = await supabase.from('events').update({ is_verified: true, report_count: 0 }).eq('id', id)
    if (!error) {
      setEventDetails({...eventDetails, is_verified: true, report_count: 0})
      toast.success('Event marked as verified')
    }
  }

  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Please select a reason')
      return
    }

    try {
      setReportLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      // Insert report
      const { error: reportError } = await supabase
        .from('reports')
        .insert([{
          event_id: id,
          reported_by: user?.id ?? 'anonymous',
          reason: reportReason
        }])

      if (reportError) {
        console.error('Report insert error:', reportError)
        toast.error(reportError.message)
        return
      }

      // Get fresh report count
      const { data: eventData, error: fetchError } = await supabase
        .from('events')
        .select('report_count')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Event fetch error:', fetchError)
        return
      }

      const newCount = (eventData.report_count ?? 0) + 1

      // Update report count
      const { error: updateError } = await supabase
        .from('events')
        .update({ report_count: newCount })
        .eq('id', id)

      if (updateError) {
        console.error('Report count update error:', updateError)
        toast.error(updateError.message)
        return
      }

      // Insert admin notification
      await supabase
        .from('admin_notifications')
        .insert([{
          type: 'event_flagged',
          message: `Event "${eventDetails?.title}" was flagged. Reason: ${reportReason}. Total reports: ${newCount}`,
          event_id: id,
          is_read: false
        }])

      // Update local event state
      setEventDetails((prev: any) => ({ ...prev, report_count: newCount }))

      // Close modal
      setReportModalOpen(false)
      setReportReason('')

      toast.success('Report submitted. Our team will review this event.')

    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setReportLoading(false)
    }
  }

  const isUnderReview = eventDetails?.report_count >= 7

  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow content-canvas pb-24 md:pb-0 relative">
          
          {isExpired && (
            <div className="w-full bg-[#F59E0B] text-gray-900 font-bold py-2 px-4 text-center z-50 relative">
              ⏰ This event has already ended
            </div>
          )}
          {isUnderReview && (
            <div style={{
              background: '#FF4D4D',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 8,
              marginBottom: 16,
              fontWeight: 600,
              fontSize: 14,
              textAlign: 'center',
              position: 'relative',
              zIndex: 50
            }}>
              🔴 This event is under review and may not be legitimate. Proceed with caution.
            </div>
          )}

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
                    {eventDetails?.is_verified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#10B981] border border-[#10B981] font-label-md text-label-md text-white uppercase tracking-wider font-bold shadow-sm">
                        ✅ Verified
                      </span>
                    )}
                    {isUnderReview && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ef4444] border border-[#ef4444] font-label-md text-label-md text-white uppercase tracking-wider font-bold shadow-sm">
                        🔴 Under Review
                      </span>
                    )}
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
                  {isOwner && (
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      disabled={deleting}
                      className="w-12 h-12 flex-shrink-0 rounded-xl shadow-sm border-2 border-red-500 text-red-500 bg-white flex items-center justify-center transition-colors hover:bg-red-50"
                      title="Delete Event"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  )}

                  {isAdmin && (
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handleVerify}
                      disabled={eventDetails?.is_verified}
                      className={`h-12 px-4 flex-shrink-0 rounded-xl shadow-sm border-2 flex items-center justify-center gap-2 transition-colors ${
                        eventDetails?.is_verified ? 'border-[#10B981] bg-[#10B981] text-white cursor-not-allowed opacity-80' : 'border-[#10B981] bg-white text-[#10B981] hover:bg-emerald-50'
                      }`}
                      title="Mark as Verified"
                    >
                      <Verified size={20} fill={eventDetails?.is_verified ? "currentColor" : "none"} />
                      <span className="hidden md:inline text-sm font-semibold">{eventDetails?.is_verified ? 'Verified' : 'Verify'}</span>
                    </motion.button>
                  )}
                  
                  {!isExpired && (
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
                  )}
                  
                  {!isOwner && (
                  <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50 md:relative md:p-0 md:bg-transparent md:shadow-none">
                    <button 
                      onClick={handleRsvp} 
                      disabled={rsvpLoading || isRsvpd || isExpired || isUnderReview}
                      className={`w-full font-body-md text-body-md px-xl py-3 md:py-4 rounded-xl shadow-sm transition-colors ${
                        isRsvpd || isExpired || isUnderReview ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-surface-tint'
                      }`}
                    >
                      {rsvpLoading ? 'Loading...' : isRsvpd ? 'You are going!' : isExpired ? 'Event Ended' : isUnderReview ? 'RSVP Disabled' : 'RSVP Now'}
                    </button>
                  </div>
                )}
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

              {eventDetails?.venue_name && (
                <div className="mt-8 border-t border-surface-variant pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline-sm text-on-surface">Location Map</h3>
                    <button 
                      onClick={() => window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(eventDetails.venue_name + ' ' + (eventDetails.city || '') + ' India')}`, '_blank')}
                      className="flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] px-4 py-2 rounded-full hover:bg-surface-tint transition-colors text-sm font-semibold"
                    >
                      🗺️ Get Directions
                    </button>
                  </div>
                  {eventDetails.location_lat && eventDetails.location_lng && (
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
                  )}
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
              <button 
                onClick={() => setReportModalOpen(true)}
                className="mt-6 text-[12px] text-[#6B7280] bg-transparent border-none hover:underline flex items-center gap-1"
              >
                🚩 Report this event
              </button>
            </div>

          </section>
        </div>

        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <h2 className="text-xl font-bold mb-1 text-gray-900">Report Event</h2>
              <p className="text-sm text-gray-500 mb-6">Help us keep StageMap trustworthy</p>
              <div className="flex flex-col gap-3 mb-8">
                {['📛 Fake or misleading event', '🔁 Duplicate event', '⚠️ Inappropriate content', '🕐 Wrong date or location', '🗑️ Spam'].map(reason => (
                  <label key={reason} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="reportReason" 
                      value={reason}
                      checked={reportReason === reason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-4 h-4 text-[#ef4444] focus:ring-[#ef4444]"
                    />
                    <span className="text-sm text-gray-700 font-medium">{reason}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setReportModalOpen(false)} 
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReport}
                  disabled={!reportReason || reportLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#ef4444] hover:bg-[#dc2626] rounded-xl disabled:opacity-50 transition-colors"
                >
                  {reportLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {rsvpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center"
            >
              <h2 className="text-xl font-bold mb-1 text-gray-900">Confirm Your RSVP</h2>
              <p className="text-sm text-gray-500 mb-6">How many people are you bringing? (including yourself)</p>
              
              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  disabled={guestCount <= 1}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    guestCount <= 1 
                      ? 'border-gray-300 bg-gray-50 text-gray-300 cursor-not-allowed' 
                      : 'border-[#7C3AED] bg-white text-[#7C3AED] hover:bg-purple-50'
                  }`}
                >
                  <Minus size={24} />
                </button>
                <span className="font-bold text-3xl text-[#7C3AED] w-8 text-center">{guestCount}</span>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                  disabled={guestCount >= 10}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    guestCount >= 10 
                      ? 'border-gray-300 bg-gray-50 text-gray-300 cursor-not-allowed' 
                      : 'border-[#7C3AED] bg-white text-[#7C3AED] hover:bg-purple-50'
                  }`}
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmRsvp}
                  disabled={rsvpLoading}
                  className="w-full py-3 text-sm font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl disabled:opacity-50 transition-colors"
                >
                  {rsvpLoading ? 'Confirming...' : 'Confirm RSVP 🎉'}
                </button>
                <button 
                  onClick={() => setRsvpModalOpen(false)} 
                  className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </Layout>
    </PageTransition>
  )
}
