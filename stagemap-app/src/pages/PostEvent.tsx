import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, Map, Calendar as CalendarIcon } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import { GoogleGenAI, Type } from '@google/genai'
import { supabase } from '../lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const parseEventDate = (rawDate: string) => {
  if (!rawDate) return null
  
  // Handle datetime-local input format: "2026-08-09T11:13"
  if (rawDate.includes('T')) {
    return new Date(rawDate).toISOString()
  }
  
  // Handle DD-MM-YYYY HH:MM format
  if (rawDate.includes('-') && rawDate.includes(' ')) {
    const [datePart, timePart] = rawDate.split(' ')
    const [dd, mm, yyyy] = datePart.split('-')
    return new Date(`${yyyy}-${mm}-${dd}T${timePart}:00`).toISOString()
  }

  // Fallback
  const parsed = new Date(rawDate)
  if (isNaN(parsed.getTime())) {
    toast.error('Invalid date format. Please pick a valid date and time.')
    return null
  }
  return parsed.toISOString()
}

export default function PostEvent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const catchErrors = (event: ErrorEvent) => {
      console.error("Caught error in PostEvent:", event.error)
    }
    window.addEventListener('error', catchErrors)
    return () => window.removeEventListener('error', catchErrors)
  }, [])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    location: '',
    date: '',
    category: 'Music'
  })

  const getEmojiForCategory = (cat: string) => {
    switch (cat) {
      case 'Music': return '🎵'
      case 'Arts': return '🎨'
      case 'Cultural': return '🎨'
      case 'Tech': return '💻'
      case 'Sports': return '⚽'
      case 'Food': return '🍜'
      case 'Competition': return '🏆'
      default: return '🎪'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.title || !formData.city || !formData.date || !formData.category) {
      setErrorMsg("Please fill out Title, City, Date, and Category.")
      return
    }

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/auth', { state: { from: location } })
        return
      }

      console.log("Submitting Event Data:", {
        title: formData.title,
        city: formData.city,
        date: formData.date,
        category: formData.category,
        description: formData.description,
      })

      const isoDate = parseEventDate(formData.date)
      if (!isoDate) {
        setSubmitting(false)
        return
      }

      const insertData = {
        title: formData.title,
        description: formData.description,
        city: formData.city,
        date: isoDate,
        category: formData.category,
        theme_emoji: getEmojiForCategory(formData.category),
        created_by: user?.id ?? null,
        rsvp_count: 0,
        venue_name: formData.location || null,
        location_lat: null, 
        location_lng: null
      }

      const { data, error } = await supabase.from('events').insert(insertData).select()
      
      console.log("Supabase Insert Response:", { data, error })

      if (error) throw error

      if (data && data[0]) {
        const postedEvents = JSON.parse(localStorage.getItem('my_posted_events') || '[]')
        postedEvents.push(data[0].id)
        localStorage.setItem('my_posted_events', JSON.stringify(postedEvents))
      }

      toast.success("🎉 Event posted!")
      navigate('/explore')
    } catch (err: any) {
      console.error("Supabase Insert Error:", err)
      setErrorMsg(err?.message ?? "Unknown error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAIAssist = async () => {
    if (!formData.title || !formData.city) {
      toast.error("Please enter a title and city for the AI to work with.")
      return
    }

    setLoading(true)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'your_gemini_api_key') {
         toast.error("AI Assist will be available after deploy")
         setLoading(false)
         return
      }

      const ai = new GoogleGenAI({ apiKey })
      
      const prompt = `Based on the event title "${formData.title}" in city "${formData.city}", generate a catchy event description, and pick one category from [Music, Arts, Tech, Sports, Food]. Return as JSON.`

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["Music", "Arts", "Tech", "Sports", "Food"] },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["description", "category", "tags"]
          }
        }
      })
      
      if (response.text) {
        const result = JSON.parse(response.text)
        setFormData(prev => ({
          ...prev,
          description: result.description,
          category: result.category
        }))
      }
    } catch (e) {
      console.error(e)
      toast.error("Failed to get AI response")
    }
    setLoading(false)
  }

  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-xl">
          <header className="flex flex-col gap-sm">
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface tracking-tight">Post a New Event</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Share what's happening. The city is waiting.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-lg bg-surface-container-lowest shadow-[0px_10px_30px_rgba(17,24,39,0.05)] rounded-xl border border-surface-variant p-lg md:p-xl mb-12">
            
            {errorMsg && (
              <div className="bg-error-container text-error font-body-sm p-3 rounded-lg text-center mb-4">
                {errorMsg}
              </div>
            )}
            <div className="flex justify-end w-full">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleAIAssist}
                type="button"
                className={`text-on-primary font-label-md text-label-md px-md py-sm rounded-full flex items-center gap-sm shadow-sm transition-all ${
                  loading ? 'bg-outline-variant animate-pulse' : 'bg-gradient-to-r from-primary to-primary-container bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]'
                }`}
              >
                <Sparkles size={16} />
                {loading ? 'Thinking...' : '✨ AI Assist'}
              </motion.button>
            </div>

            <div className="flex flex-col gap-md">
              <label className="flex flex-col gap-unit">
                <span className="font-label-md text-label-md text-on-surface">Event Title</span>
                <input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline" 
                  placeholder="e.g. Neon Nights Indie Fest" 
                  type="text"
                />
              </label>

              <label className="flex flex-col gap-unit">
                <span className="font-label-md text-label-md text-on-surface">Description</span>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-outline" 
                  placeholder="What's the vibe? Who's playing?" 
                  rows={3}
                ></textarea>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <label className="flex flex-col gap-unit">
                <span className="font-label-md text-label-md text-on-surface">City</span>
                <div className="relative">
                  <Map className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
                  <input 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-xl pr-md py-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline" 
                    placeholder="e.g. Haldwani, Rudrapur, Bareilly" 
                    type="text"
                  />
                </div>
              </label>
              
              <label className="flex flex-col gap-unit">
                <span className="font-label-md text-label-md text-on-surface">Specific Location / Venue</span>
                <div className="relative">
                  <MapPin className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
                  <input 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-xl pr-md py-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline" 
                    placeholder="e.g. District Ground, Main Market, College Auditorium, Near Bus Stand" 
                    type="text"
                  />
                </div>
              </label>
              
              <label className="flex flex-col gap-unit">
                <span className="font-label-md text-label-md text-on-surface">Date & Time</span>
                <div className="relative">
                  <CalendarIcon className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
                  <input 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-xl pr-md py-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface-variant" 
                    type="datetime-local"
                  />
                </div>
                <span className="text-[12px] text-[#6B7280] mt-1">📅 Pick date and time from the calendar picker</span>
              </label>
            </div>


            <div className="flex flex-col gap-sm">
              <span className="font-label-md text-label-md text-on-surface">Event Identity (Choose a vibe)</span>
              <div className="flex flex-wrap gap-sm">
                {['Music', 'Arts', 'Tech', 'Sports', 'Food'].map(cat => (
                  <label key={cat} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="vibe" 
                      className="peer sr-only" 
                      checked={formData.category === cat}
                      onChange={() => setFormData({...formData, category: cat})}
                    />
                    <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 hover:bg-surface-container-highest transition-colors peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary shadow-sm font-label-md text-label-md text-on-surface-variant">
                      <span>{cat === 'Music' ? '🎤' : cat === 'Arts' ? '🎨' : cat === 'Tech' ? '💻' : cat === 'Sports' ? '⚽' : '🍜'}</span>
                      <span>{cat}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <motion.button 
              whileTap={submitting ? {} : { scale: 0.98 }}
              disabled={submitting}
              className={`w-full font-body-md text-body-md px-xl py-4 rounded-xl shadow-sm mt-md transition-colors ${
                submitting ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-surface-tint'
              }`}
              type="submit"
            >
              {submitting ? 'Posting...' : 'Post Event to StageMap'}
            </motion.button>
          </form>
        </div>
      </Layout>
    </PageTransition>
  )
}
