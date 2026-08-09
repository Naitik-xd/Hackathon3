import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { Grid, Map as MapIcon, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
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
        .select('id, title, theme_emoji, category, location_lat, location_lng')
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null)
      
      if (data) {
        setLocations(data)
      }
    }
    fetchLocations()
  }, [])

  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full h-[calc(100vh-80px)] flex flex-col relative">
          
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
                { label: 'Cultural', icon: '🎨' },
                { label: 'Tech', icon: '💻' },
              ].map((chip) => (
                <motion.button 
                  key={chip.label}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(chip.label)}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 border shadow-[0px_10px_30px_rgba(17,24,39,0.05)] transition-colors ${
                    activeCategory === chip.label 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant'
                  }`}
                >
                  <span className="text-[16px]">{chip.icon}</span>
                  <span className="font-label-md text-label-md hidden md:inline">{chip.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 border border-outline-variant pointer-events-auto shadow-sm">
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
              attribution='&copy; OpenStreetMap'
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
      </Layout>
    </PageTransition>
  )
}
