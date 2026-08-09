import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import { Megaphone, CalendarCheck, Edit2, Check, X, LogOut, Camera, Trash2, ShieldAlert, ShieldCheck, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

export default function MyProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<{ display_name: string, city: string, avatar_url?: string } | null>(null)
  const [stats, setStats] = useState({ posted: 0, attended: 0 })
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminNotifications, setAdminNotifications] = useState<any[]>([])
  const [unverifiedEvents, setUnverifiedEvents] = useState<any[]>([])
  const [adminActiveTab, setAdminActiveTab] = useState<'flags' | 'verify'>('flags')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ display_name: '', city: '' })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserEmail(user.email || '')

    // Fetch Profile
    let { data: profileData } = await supabase
      .from('profiles')
      .select('display_name, city, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profileData) {
      // Auto-create
      const newDisplayName = user.email ? user.email.split('@')[0] : 'Guest User'
      const { data: newProfile } = await supabase.from('profiles').insert({
        user_id: user.id,
        display_name: newDisplayName,
        city: 'Not set'
      }).select().single()
      
      profileData = newProfile
    }

    if (profileData) {
      setProfile(profileData)
      setEditForm(profileData)
    }

    // Fetch Stats
    const { count: postedCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)

    const { count: attendedCount } = await supabase
      .from('rsvp')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    setStats({
      posted: postedCount || 0,
      attended: attendedCount || 0
    })

    if (user.email === 'naitik.270810@gmail.com') {
      setIsAdmin(true)
      const { data: notifs } = await supabase
        .from('admin_notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
      if (notifs) setAdminNotifications(notifs)
      
      const { data: unverified } = await supabase
        .from('events')
        .select('*')
        .eq('is_verified', false)
        .order('created_at', { ascending: false })
      if (unverified) setUnverifiedEvents(unverified)
    }

    setLoading(false)
  }

  const markAsRead = async (id: string) => {
    await supabase.from('admin_notifications').update({ is_read: true }).eq('id', id)
    setAdminNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleVerifyEvent = async (id: string) => {
    const { error } = await supabase.from('events').update({ is_verified: true, report_count: 0 }).eq('id', id)
    if (!error) {
      setUnverifiedEvents(prev => prev.filter(e => e.id !== id))
      toast.success('Event verified')
    } else {
      toast.error('Failed to verify event')
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
    
    // First delete saved events references
    await supabase.from('saved_events').delete().eq('event_id', id)
    
    // Then delete rsvp references
    await supabase.from('rsvp').delete().eq('event_id', id)
    
    // Then delete reports
    await supabase.from('reports').delete().eq('event_id', id)
    
    // Finally delete event
    const { error } = await supabase.from('events').delete().eq('id', id)
    
    if (!error) {
      setUnverifiedEvents(prev => prev.filter(e => e.id !== id))
      toast.success('Event deleted')
    } else {
      toast.error('Failed to delete event')
      console.error(error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setUploadingAvatar(false)
      return
    }

    const filePath = `${user.id}/avatar.jpg`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    
    if (uploadError) {
      toast.error('Failed to upload image')
      console.error(uploadError)
    } else {
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const avatar_url = `${publicUrlData.publicUrl}?t=${Date.now()}` // bypass cache

      await supabase.from('profiles').update({ avatar_url }).eq('user_id', user.id)
      setProfile(prev => prev ? { ...prev, avatar_url } : null)
      toast.success('Avatar updated!')
    }
    setUploadingAvatar(false)
  }

  const handleSaveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: editForm.display_name, city: editForm.city })
      .eq('user_id', user.id)

    if (error) {
      toast.error("Failed to update profile")
      return
    }

    setProfile(editForm)
    setIsEditing(false)
    toast.success("Profile updated ✅")
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex justify-center items-center h-screen">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  const initials = profile?.display_name ? profile.display_name.substring(0, 2).toUpperCase() : 'ME'

  return (
    <PageTransition>
      <Layout>
        <div className="flex-1 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-xl">
          
          {/* Profile Header */}
          <section className="flex flex-col items-center text-center gap-md pt-xl relative">
            <div className="absolute top-4 right-4">
              <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 border-2 border-[#FF4D4D] text-[#FF4D4D] rounded-full hover:bg-[#FF4D4D]/10 transition-colors font-semibold text-sm">
                <LogOut size={16} /> Sign Out
              </button>
            </div>



            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-xl text-headline-xl shadow-[0px_10px_30px_rgba(17,24,39,0.05)] cursor-pointer relative group overflow-hidden mt-8"
              onClick={() => fileInputRef.current?.click()}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploadingAvatar ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Camera className="text-white" size={28} />}
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleAvatarUpload} />
            
            {isEditing ? (
              <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
                <input 
                  type="text" 
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({...editForm, display_name: e.target.value})}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-md text-center focus:border-primary focus:outline-none"
                  placeholder="Display Name"
                />
                <input 
                  type="text" 
                  value={editForm.city}
                  onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-md text-center focus:border-primary focus:outline-none"
                  placeholder="City"
                />
                <div className="flex gap-2 justify-center mt-2">
                  <button onClick={handleSaveProfile} className="bg-primary text-white p-2 rounded-full shadow-sm hover:bg-primary/90">
                    <Check size={20} />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-surface-variant text-on-surface p-2 rounded-full shadow-sm hover:bg-surface-variant/80">
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg flex items-center justify-center gap-2">
                  {profile?.display_name || 'Guest User'}
                  <button onClick={() => setIsEditing(true)} className="p-1.5 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                    <Edit2 size={14} />
                  </button>
                </h1>
                <p className="font-body-lg text-body-lg flex items-center justify-center gap-1 mt-1">
                  📍 {profile?.city && profile.city !== 'Not set' ? profile.city : <span className="text-primary/70 cursor-pointer hover:text-primary" onClick={() => setIsEditing(true)}>Add your city</span>}
                </p>
                {userEmail && (
                  <p className="text-gray-500 text-xs mt-2">✉️ {userEmail}</p>
                )}
              </div>
            )}
          </section>

          {/* Stats Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Events Posted */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_10px_30px_rgba(17,24,39,0.05)] flex flex-col items-center gap-2 transition-transform cursor-default"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Megaphone size={28} />
              </div>
              <div className="font-headline-md text-headline-md text-indigo-600">{stats.posted}</div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase">Events Posted</div>
            </motion.div>

            {/* Events Attended */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_10px_30px_rgba(17,24,39,0.05)] flex flex-col items-center gap-2 transition-transform cursor-default"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CalendarCheck size={28} />
              </div>
              <div className="font-headline-md text-headline-md text-emerald-600">{stats.attended}</div>
              <div className="font-label-md text-label-md text-on-surface-variant uppercase">Events Attended</div>
            </motion.div>

          </section>

          {/* Admin Panel */}
          {isAdmin && (
            <section className="bg-surface border-2 border-primary rounded-xl p-lg shadow-[0px_10px_30px_rgba(124,58,237,0.1)] relative mt-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2 font-bold text-xl">
                    <ShieldCheck size={24} /> 🛡️ Admin Panel
                  </h2>
                  <p className="font-body-md text-on-surface-variant mt-1">Logged in as admin · naitik.270810@gmail.com</p>
                </div>
                <div className="flex bg-surface-container-lowest border border-outline-variant rounded-lg p-1">
                  <button
                    onClick={() => setAdminActiveTab('flags')}
                    className={`px-4 py-2 rounded-md font-label-md transition-colors relative ${adminActiveTab === 'flags' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'}`}
                  >
                    🚩 Flagged Events
                    {adminNotifications.length > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF4D4D] text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm">
                        {adminNotifications.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setAdminActiveTab('verify')}
                    className={`px-4 py-2 rounded-md font-label-md transition-colors ${adminActiveTab === 'verify' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'}`}
                  >
                    ✅ Verify Events
                  </button>
                </div>
              </div>

              {adminActiveTab === 'flags' && (
                <div className="flex flex-col gap-4">
                  {adminNotifications.length === 0 ? (
                    <div className="text-center py-8 text-[#10B981] font-bold bg-surface-container-lowest rounded-lg border border-outline-variant/30">🎉 No new flags</div>
                  ) : (
                    adminNotifications.map(notif => (
                      <div key={notif.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex-1">
                          <p className="font-body-md text-on-surface">{notif.message}</p>
                          <p className="text-xs text-on-surface-variant mt-2 font-medium">{new Date(notif.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Link 
                            to={`/event/${notif.event_id}`} 
                            className="text-primary hover:underline font-label-md flex items-center gap-1 px-3 py-1.5"
                          >
                            View Event <ExternalLink size={14} />
                          </Link>
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="bg-surface-variant hover:bg-surface-variant/80 text-on-surface-variant px-3 py-1.5 rounded-md font-label-md flex items-center gap-1 transition-colors"
                          >
                            <Check size={16} /> Mark as Read ✓
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {adminActiveTab === 'verify' && (
                <div className="flex flex-col gap-4">
                  {unverifiedEvents.length === 0 ? (
                    <div className="text-center py-8 text-on-surface-variant font-medium bg-surface-container-lowest rounded-lg border border-outline-variant/30">All events are verified!</div>
                  ) : (
                    unverifiedEvents.map(ev => (
                      <div key={ev.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                            {ev.theme_emoji || '🎭'}
                          </div>
                          <div>
                            <h3 className="font-headline-sm text-on-surface line-clamp-1">{ev.title}</h3>
                            <p className="font-body-sm text-on-surface-variant mt-1 flex flex-wrap gap-2 items-center">
                              <span>{ev.city}</span>
                              <span className="text-outline-variant">•</span>
                              <span>{new Date(ev.date).toLocaleDateString()}</span>
                              <span className="text-outline-variant">•</span>
                              <span className={ev.report_count >= 7 ? "text-[#FF4D4D] font-bold" : ""}>🔴 {ev.report_count || 0} Reports</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/event/${ev.id}`} 
                            className="bg-surface-variant hover:bg-surface-variant/80 text-on-surface-variant px-3 py-2 rounded-md flex items-center justify-center transition-colors"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <button 
                            onClick={() => handleVerifyEvent(ev.id)}
                            className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-md font-label-md flex items-center gap-1 transition-colors"
                          >
                            ✅ Verify
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="bg-[#FF4D4D] hover:bg-[#DC2626] text-white px-4 py-2 rounded-md font-label-md flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>
          )}

          {/* Action Button */}
          <section className="flex justify-center pb-xl">
            <Link 
              to="/tickets"
              className="bg-primary text-on-primary font-headline-sm text-headline-sm px-8 py-4 rounded-xl shadow-md hover:bg-primary/90 transition-transform active:scale-95 flex items-center gap-2"
            >
              View My Tickets 🎟️
            </Link>
          </section>
          
        </div>
      </Layout>
    </PageTransition>
  )
}
