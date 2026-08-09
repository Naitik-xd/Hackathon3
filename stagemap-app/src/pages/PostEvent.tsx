import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MapPin, Map, Calendar as CalendarIcon, Plus, Minus, Search, Check } from 'lucide-react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
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
  const [guestCount, setGuestCount] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Venue Search State
  const [venueSearch, setVenueSearch] = useState('')
  const [venueResults, setVenueResults] = useState<any[]>([])
  const [selectedVenue, setSelectedVenue] = useState<{name: string, lat: number, lng: number} | null>(null)
  
  useEffect(() => {
    if (venueSearch.length < 3) {
      setVenueResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(venueSearch)}&countrycodes=in&format=json&limit=5`, {
          headers: { 'Accept-Language': 'en' }
        })
        const results = await res.json()
        setVenueResults(results)
      } catch (err) {
        console.error('Nominatim error:', err)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [venueSearch])

  // Custom Icon for Mini Map
  const customIcon = new L.DivIcon({
    html: `<div style="font-size: 24px;">📍</div>`,
    className: 'custom-venue-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  })

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
        guest_count: guestCount,
        venue_name: selectedVenue?.name ?? null,
        location_lat: selectedVenue?.lat ?? null, 
        location_lng: selectedVenue?.lng ?? null
      }

      const { data, error } = await supabase.from('events').insert(insertData)
      
      console.log("Supabase Insert Response:", { data, error })

      if (error) throw error

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
                <span className="font-label-md text-label-md text-on-surface">Specific Location</span>
                <div className="relative">
                  <Search className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
                  <input 
                    value={venueSearch}
                    onChange={(e) => {
                      setVenueSearch(e.target.value)
                      setSelectedVenue(null) // clear on edit
                    }}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-xl pr-md py-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline" 
                    placeholder="Search venue or address..." 
                    type="text"
                  />
                  
                  <AnimatePresence>
                    {venueResults.length > 0 && !selectedVenue && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto"
                      >
                        {venueResults.map((res: any, idx: number) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSelectedVenue({
                                name: res.display_name.split(',')[0],
                                lat: parseFloat(res.lat),
                                lng: parseFloat(res.lon)
                              })
                              setVenueSearch('')
                              setVenueResults([])
                            }}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 border-b border-gray-50 last:border-0"
                          >
                            <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{res.display_name.split(',')[0]}</p>
                              <p className="text-xs text-gray-500 line-clamp-1">{res.display_name}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {selectedVenue && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 flex flex-col gap-3"
                  >
                    <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-3 py-1.5 rounded-full text-sm font-medium border border-[#7C3AED]/20 self-start">
                      <span>📍 {selectedVenue.name}</span>
                      <Check size={14} />
                    </div>
                    <div className="w-full h-[200px] rounded-xl overflow-hidden border border-outline-variant relative z-0">
                      <MapContainer 
                        center={[selectedVenue.lat, selectedVenue.lng]} 
                        zoom={15} 
                        className="w-full h-full"
                        zoomControl={false}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[selectedVenue.lat, selectedVenue.lng]} icon={customIcon} />
                      </MapContainer>
                    </div>
                  </motion.div>
                )}
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

            <div className="grid grid-cols-1 gap-md">
              <label className="flex flex-col gap-unit">
                <span className="font-label-md text-label-md text-on-surface">How many are you bringing? (including yourself)</span>
                <div className="flex items-center gap-4 mt-1">
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    disabled={guestCount <= 1}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ${
                      guestCount <= 1 
                        ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed' 
                        : 'border-[#7C3AED] bg-white text-[#7C3AED] hover:bg-gray-50'
                    }`}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="font-bold text-[20px] text-[#7C3AED] w-4 text-center">{guestCount}</span>
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                    disabled={guestCount >= 10}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ${
                      guestCount >= 10 
                        ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed' 
                        : 'border-[#7C3AED] bg-white text-[#7C3AED] hover:bg-gray-50'
                    }`}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </label>
            </div>

            <hr className="border-surface-variant border-t" />

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
