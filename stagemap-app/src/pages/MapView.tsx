import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { Grid, Map as MapIcon, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'

const createCustomIcon = (emoji: string, category: string) => {
  // Determine color based on category (rough mapping based on earlier themes)
  let bgColor = '#10B981' // emerald for default
  if (category === 'Cultural' || category === 'Art') bgColor = '#F59E0B' // amber
  if (category === 'Tech') bgColor = '#3B82F6' // blue
  if (category === 'Music') bgColor = '#8B5CF6' // violet
  if (category === 'Food') bgColor = '#EF4444' // red
  if (category === 'Sports') bgColor = '#F97316' // orange
  if (category === 'Wellness') bgColor = '#06B6D4' // cyan

  const html = `
    <div style="
      background-color: white;
      border: 3px solid ${bgColor};
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      position: relative;
    ">
      ${emoji}
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid ${bgColor};
      "></div>
    </div>
  `

  return new L.DivIcon({
    html,
    className: 'custom-map-marker',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44]
  })
}

export default function MapView() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [locations, setLocations] = useState<any[]>([])

  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase
        .from('events')
        .select('id, title, theme_emoji, category, location_lat, location_lng, date, is_expired')
        .lt('report_count', 7)
        .eq('is_expired', false)
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null)
      
      if (data) {
        const now = new Date()
        const activeLocations = data.filter(d => !d.date || new Date(d.date) > now)
        setLocations(activeLocations)
      }
    }
    fetchLocations()
  }, [])

  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full h-[calc(100vh-80px)] flex flex-col md:flex-row relative">
          
          <div className="w-full h-[60vh] md:h-full relative flex-shrink-0 z-0 flex-grow">
            {/* Overlay Controls */}
            <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row justify-between items-start md:items-center gap-md pointer-events-none">
              <div className="flex flex-wrap items-center gap-sm pointer-events-auto">
                <div className="relative">
                  <button className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 hover:border-primary shadow-[0px_10px_30px_rgba(17,24,39,0.05)]">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">Bengaluru</span>
                    <ChevronDown size={18} />
                  </button>
                </div>
                
                {/* Chips */}
                {[
                  { label: 'Competition', icon: '🏆' },
                  { label: 'Cultural', icon: '🎭' },
                  { label: 'Concert', icon: '🎸' }
                ].map(chip => (
                  <button 
                    key={chip.label}
                    onClick={() => setActiveCategory(activeCategory === chip.label ? 'All' : chip.label)}
                    className={`flex items-center gap-1 border rounded-full px-4 py-2 shadow-sm transition-colors ${
                      activeCategory === chip.label 
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-surface-container-lowest border-outline-variant hover:border-primary text-on-surface'
                    }`}
                  >
                    <span>{chip.icon}</span>
                    <span className="font-body-sm text-body-sm font-medium">{chip.label}</span>
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 border border-outline-variant pointer-events-auto shadow-sm hidden md:flex">
                <Link to="/explore" className="flex items-center justify-center p-2 rounded-md text-on-surface-variant hover:text-primary transition-colors">
                  <Grid size={20} />
                </Link>
                <button className="flex items-center justify-center p-2 rounded-md bg-surface-variant text-primary shadow-sm">
                  <MapIcon size={20} />
                </button>
              </div>
            </div>

            <MapContainer 
              center={[29.0, 79.2]} 
              zoom={8} 
              className="w-full h-full z-0"
              zoomControl={false}
            >
              <TileLayer
                attribution='OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locations.map(loc => {
                if (activeCategory !== 'All' && loc.category !== activeCategory) return null;
                return (
                  <Marker key={loc.id} position={[loc.location_lat, loc.location_lng]} icon={createCustomIcon(loc.theme_emoji || '📍', loc.category)}>
                    <Popup>
                      <div className="text-center font-body-sm">
                        <div className="text-2xl mb-1">{loc.theme_emoji || '📍'}</div>
                        <Link to={`/event/${loc.id}`} className="font-bold text-primary hover:underline">{loc.title}</Link>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>

          <div className="md:hidden w-full h-[40vh] bg-white border-t border-gray-200 overflow-y-auto p-4 flex flex-col gap-3">
            <h3 className="font-bold text-gray-900 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">Events Nearby</h3>
            {locations.filter(loc => activeCategory === 'All' || loc.category === activeCategory).length === 0 && (
              <p className="text-gray-500 text-sm">No events found in this area.</p>
            )}
            {locations.filter(loc => activeCategory === 'All' || loc.category === activeCategory).map(loc => (
              <Link key={loc.id} to={`/event/${loc.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                <div className="text-2xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0">{loc.theme_emoji || '📍'}</div>
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-1">{loc.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{loc.category || 'Event'}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </Layout>
    </PageTransition>
  )
}
