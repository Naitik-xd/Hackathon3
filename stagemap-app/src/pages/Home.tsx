import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <PageTransition>
      <Layout>
        {/* Main Hero Section */}
        <div className="relative w-full pt-20 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
          {/* Background Floating Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40 md:opacity-100">
            {/* Event Card 1 */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-10 left-10 md:left-20 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-[0px_10px_30px_rgba(17,24,39,0.05)] p-md w-48 hidden sm:block"
            >
              <div className="flex justify-between items-start mb-sm">
                <div className="text-4xl">🎵</div>
                <span className="bg-primary-container text-on-primary-container font-label-md text-label-md px-2 py-1 rounded-full">Music</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Haldwani</p>
              <p className="font-headline-sm text-headline-sm text-on-surface truncate">Kumaon Folk</p>
            </motion.div>
            
            {/* Event Card 2 */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 8, delay: 2, ease: "easeInOut" }}
              className="absolute top-32 right-5 md:right-32 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-[0px_10px_30px_rgba(17,24,39,0.05)] p-md w-52 hidden sm:block"
            >
              <div className="flex justify-between items-start mb-sm">
                <div className="text-4xl">🍜</div>
                <span className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-2 py-1 rounded-full">Food</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Kichha</p>
              <p className="font-headline-sm text-headline-sm text-on-surface truncate">Street Food</p>
            </motion.div>

            {/* Event Card 3 */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 7, delay: 4, ease: "easeInOut" }}
              className="absolute bottom-20 left-5 md:left-40 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-[0px_10px_30px_rgba(17,24,39,0.05)] p-md w-44 hidden md:block"
            >
              <div className="flex justify-between items-start mb-sm">
                <div className="text-4xl">💻</div>
                <span className="bg-tertiary-container text-on-tertiary-container font-label-md text-label-md px-2 py-1 rounded-full">Tech</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Rudrapur</p>
              <p className="font-headline-sm text-headline-sm text-on-surface truncate">AI & Robotics</p>
            </motion.div>

            {/* Event Card 4 */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 6.5, delay: 1, ease: "easeInOut" }}
              className="absolute bottom-32 right-10 md:right-48 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-[0px_10px_30px_rgba(17,24,39,0.05)] p-md w-48 hidden md:block"
            >
              <div className="flex justify-between items-start mb-sm">
                <div className="text-4xl">🎨</div>
                <span className="bg-error-container text-on-error-container font-label-md text-label-md px-2 py-1 rounded-full">Cultural</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Bareilly</p>
              <p className="font-headline-sm text-headline-sm text-on-surface truncate">Photo Walk</p>
            </motion.div>
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto">
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-lg md:text-5xl lg:text-7xl leading-tight tracking-tight">
              Your City Has More Going On Than You Think
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl mx-auto">
              StageMap brings hidden events in tier-2 and tier-3 India to the surface — college fests, local competitions, cultural nights, street food battles and more. No ticket fees. No metro bias. Just your city, alive.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-md w-full sm:w-auto">
              <Link to="/explore" className="w-full sm:w-auto bg-primary text-on-primary font-body-md text-body-md px-xl py-3 rounded-full hover:bg-surface-tint active:scale-95 transition-all shadow-sm h-12 flex items-center justify-center whitespace-nowrap">
                Explore Events
              </Link>
              <Link to="/post" className="w-full sm:w-auto bg-transparent border-2 border-secondary text-secondary font-body-md text-body-md px-xl py-3 rounded-full hover:bg-secondary-fixed active:scale-95 transition-all h-12 flex items-center justify-center whitespace-nowrap">
                Post an Event
              </Link>
            </div>
            {/* Quick Chips */}
            <div className="mt-16 flex flex-wrap justify-center gap-sm max-w-2xl">
              <motion.span whileTap={{ scale: 0.96 }} className="bg-surface-container-lowest border border-surface-variant rounded-full px-4 py-2 font-label-md text-label-md text-on-surface cursor-pointer hover:bg-surface-variant transition-colors">Today</motion.span>
              <motion.span whileTap={{ scale: 0.96 }} className="bg-surface-container-lowest border border-surface-variant rounded-full px-4 py-2 font-label-md text-label-md text-on-surface cursor-pointer hover:bg-surface-variant transition-colors">Music</motion.span>
              <motion.span whileTap={{ scale: 0.96 }} className="bg-surface-container-lowest border border-surface-variant rounded-full px-4 py-2 font-label-md text-label-md text-on-surface cursor-pointer hover:bg-surface-variant transition-colors">Workshops</motion.span>
              <motion.span whileTap={{ scale: 0.96 }} className="bg-surface-container-lowest border border-surface-variant rounded-full px-4 py-2 font-label-md text-label-md text-on-surface cursor-pointer hover:bg-surface-variant transition-colors">Comedy</motion.span>
            </div>
          </div>
        </div>
      </Layout>
    </PageTransition>
  )
}
