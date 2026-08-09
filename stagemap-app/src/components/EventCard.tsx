import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Calendar, Users, Bookmark } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

export interface EventProps {
  id: string
  title: string
  category: string
  location: string
  time: string
  rsvpCount: string
  emoji: string
  bgClass: string
  isLive?: boolean
  is_verified?: boolean
  reportCount?: number
}

export default function EventCard({ event }: { event: EventProps }) {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkSavedStatus()
  }, [event.id])

  const checkSavedStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('saved_events')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .single()

    if (data) setIsSaved(true)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast('Sign in to save events', { icon: '🔖' })
      return
    }

    setLoading(true)
    if (isSaved) {
      // Unsave
      await supabase
        .from('saved_events')
        .delete()
        .eq('event_id', event.id)
        .eq('user_id', user.id)
      setIsSaved(false)
      toast('Removed from saved', { icon: '🗑️' })
    } else {
      // Save
      await supabase
        .from('saved_events')
        .insert({ event_id: event.id, user_id: user.id })
      setIsSaved(true)
      toast.success('Event saved!')
    }
    setLoading(false)
  }

  return (
    <motion.article 
      whileHover={{ scale: 1.02, y: -4 }}
      className={`bg-surface-container-lowest rounded-xl shadow-[0px_10px_30px_rgba(17,24,39,0.05)] overflow-hidden flex flex-col relative ${
        (event.reportCount ?? 0) >= 7 ? 'border-2 border-[#ef4444] opacity-90' 
        : event.is_verified ? 'border-2 border-[#10B981]' 
        : 'border border-outline-variant/30'
      }`}
    >
      <button 
        onClick={handleSave}
        disabled={loading}
        className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm transition-colors hover:bg-white"
      >
        <Bookmark 
          size={20} 
          className={isSaved ? "text-[#7C3AED]" : "text-gray-500"} 
          fill={isSaved ? "#7C3AED" : "none"}
        />
      </button>

      {((event.reportCount ?? 0) >= 7 || event.is_verified) && (
        <div className={`absolute top-4 left-16 z-10 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1 ${
          (event.reportCount ?? 0) >= 7 ? 'bg-[#ef4444]' : 'bg-[#10B981]'
        }`}>
          {(event.reportCount ?? 0) >= 7 ? '🔴 Under Review' : '✅ Verified'}
        </div>
      )}

      <div className={`h-40 ${event.bgClass} flex items-center justify-center relative`}>
        <span className="text-6xl">{event.emoji}</span>
        {event.isLive && (
          <div className="absolute top-sm right-sm bg-secondary text-on-secondary font-label-md text-label-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-on-secondary animate-pulse"></span>
            Live
          </div>
        )}
      </div>
      <div className="p-md flex flex-col flex-grow gap-sm">
        <div className="flex justify-between items-start">
          <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-2 leading-tight">
            {event.title}
          </h3>
          <span className="bg-primary-fixed-dim text-on-primary-fixed px-2 py-1 rounded-full font-label-md text-[10px] uppercase whitespace-nowrap ml-2">
            {event.category}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-on-surface-variant mt-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="font-body-sm text-body-sm">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="font-body-sm text-body-sm">{event.time}</span>
          </div>
        </div>
        <div className="mt-auto pt-md flex items-center justify-between border-t border-outline-variant/20">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <Users size={18} />
            <span className="font-label-md text-label-md">{event.rsvpCount} RSVP</span>
          </div>
          <Link 
            to={`/event/${event.id}`}
            className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg active:scale-95 min-h-[40px] flex items-center justify-center hover:bg-on-primary-fixed-variant transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
