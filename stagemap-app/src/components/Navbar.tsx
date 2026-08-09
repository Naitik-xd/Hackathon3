import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MapPin, Bell, Menu, X, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  
  const navLinks = [
    { name: 'Discover', path: '/explore' },
    { name: 'Our Vision', path: '/vision' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Saved', path: '/saved' },
    { name: 'My Tickets 🎟️', path: '/tickets' },
    { name: 'Profile', path: '/profile' }
  ]

  // City Selector State
  const [cityOpen, setCityOpen] = useState(false)
  const [userCity, setUserCity] = useState(localStorage.getItem('userCity') || '')
  const cities = ['Haldwani', 'Rudrapur', 'Bareilly', 'Kichha', 'Moradabad', 'Rampur', 'Kashipur', 'Haridwar']

  const handleCitySelect = (city: string) => {
    setUserCity(city)
    localStorage.setItem('userCity', city)
    setCityOpen(false)
  }

  // Notifications State
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [unread, setUnread] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setSession(user)

      let notifs: string[] = []
      
      // 1. RSVPs on user's events
      const { data: myEvents } = await supabase.from('events').select('id, title').eq('created_by', user.id)
      if (myEvents && myEvents.length > 0) {
        const eventIds = myEvents.map(e => e.id)
        const { data: rsvps } = await supabase.from('rsvp').select('event_id').in('event_id', eventIds).order('created_at', { ascending: false }).limit(3)
        if (rsvps) {
          rsvps.forEach(rsvp => {
            const ev = myEvents.find(e => e.id === rsvp.event_id)
            notifs.push(`🎉 Your event ${ev?.title} got a new RSVP`)
          })
        }
      }

      // 2. New events in userCity
      if (userCity) {
        const { data: cityEvents } = await supabase.from('events').select('title, city').eq('city', userCity).order('created_at', { ascending: false }).limit(3)
        if (cityEvents) {
          cityEvents.forEach(ev => {
            notifs.push(`📍 New event in ${ev.city}: ${ev.title}`)
          })
        }
      }

      setNotifications(notifs)
      if (notifs.length > 0) setUnread(true)
    }
    fetchNotifications()
  }, [userCity])

  const handleNotifOpen = () => {
    setNotifOpen(!notifOpen)
    if (!notifOpen) {
      setUnread(false)
    }
  }

  // Close dropdowns on click outside
  const cityRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    toast.success('Signed out successfully')
    navigate('/')
  }

  return (
    <nav className="docked full-width top-0 sticky z-50 bg-surface shadow-sm transition-colors duration-300 relative">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 -ml-2 text-on-surface"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <Link className="font-headline-lg-mobile text-headline-lg-mobile font-black text-primary flex items-center gap-1" to="/">
            StageMap 📍
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="flex gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname.includes(link.path)
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-base font-semibold transition-all border-b-2 ${
                    isActive
                      ? 'text-primary border-primary'
                      : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-sm">
          {/* City Selector Dropdown */}
          <div className="relative hidden sm:block" ref={cityRef}>
            <button 
              onClick={() => setCityOpen(!cityOpen)}
              className="px-3 py-2 text-primary hover:bg-surface-container-highest rounded-full transition-colors flex items-center gap-1 font-semibold text-sm"
            >
              <MapPin size={24} />
              {userCity ? userCity : ''}
            </button>
            <AnimatePresence>
              {cityOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[100]"
                >
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-1">Select City</div>
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        userCity === city ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={handleNotifOpen}
              className="p-2 text-primary hover:bg-surface-container-highest rounded-full transition-colors relative"
            >
              <Bell size={24} />
              {unread && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface"></span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[100]"
                >
                  <div className="px-4 py-3 text-sm font-semibold text-gray-800 border-b border-gray-100">
                    Notifications
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="px-4 py-3 text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          {notif}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-sm text-gray-500 text-center flex flex-col items-center gap-2">
                        <span className="text-2xl">🔕</span>
                        No new notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sign Out Button */}
          {session && (
            <button 
              onClick={handleSignOut}
              className="p-2 text-[#FF4D4D] hover:bg-[#FF4D4D]/10 rounded-full transition-colors relative"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-surface border-b border-surface-variant shadow-lg md:hidden overflow-hidden z-[90]"
          >
            <div className="flex flex-col py-2">
              {navLinks.map((link) => {
                const isActive = location.pathname.includes(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`h-12 flex items-center px-margin-mobile text-lg font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-on-surface hover:bg-surface-variant border-l-4 border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
