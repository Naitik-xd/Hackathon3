import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, MapPin, Calendar, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { format, parseISO } from 'date-fns'

export default function TicketVerify() {
  const { eventId, userId } = useParams()
  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [eventData, setEventData] = useState<any>(null)
  const [attendeeName, setAttendeeName] = useState<string>('Guest')

  useEffect(() => {
    const verifyTicket = async () => {
      if (!eventId || !userId) {
        setLoading(false)
        return
      }

      try {
        // Check RSVP
        const { data: rsvpData, error: rsvpError } = await supabase
          .from('rsvp')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', userId)
          .maybeSingle()
        
        if (rsvpError || !rsvpData) {
          setIsValid(false)
          setLoading(false)
          return
        }

        // Fetch Event Data
        const { data: event } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()
        
        if (event) {
          setEventData(event)
        }

        // Fetch Profile Data
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', userId)
          .maybeSingle()

        if (profile?.display_name) {
          setAttendeeName(profile.display_name)
        }

        setIsValid(true)
      } catch (err) {
        console.error('Verification error:', err)
        setIsValid(false)
      } finally {
        setLoading(false)
      }
    }
    verifyTicket()
  }, [eventId, userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className={`p-8 text-center ${isValid ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <div className="flex justify-center mb-4">
            {isValid ? (
              <CheckCircle className="text-emerald-500 w-20 h-20" />
            ) : (
              <XCircle className="text-red-500 w-20 h-20" />
            )}
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isValid ? 'text-emerald-700' : 'text-red-700'}`}>
            {isValid ? 'Valid Entry Pass' : 'Invalid Ticket'}
          </h1>
          <p className={isValid ? 'text-emerald-600' : 'text-red-600'}>
            {isValid ? 'Welcome to the event!' : 'Unregistered or invalid QR code scanned.'}
          </p>
        </div>

        {isValid && eventData && (
          <div className="p-8">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl">{eventData.theme_emoji || '🎫'}</span>
                <h2 className="text-xl font-bold text-gray-900">{eventData.title}</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <User className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Attendee Name</p>
                  <p className="font-semibold text-lg text-gray-900">{attendeeName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <Calendar className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Date & Time</p>
                  <p className="font-medium text-lg text-gray-900">
                    {eventData.date ? format(parseISO(eventData.date), 'EEE, MMM d, yyyy • h:mm a') : 'TBA'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Location</p>
                  <p className="font-medium text-lg text-gray-900">{eventData.city}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
          <Link to="/" className="text-primary font-semibold hover:underline">
            ← Back to StageMap
          </Link>
        </div>
      </div>
    </div>
  )
}
