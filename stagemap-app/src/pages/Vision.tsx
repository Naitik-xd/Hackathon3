import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'

export default function Vision() {
  return (
    <PageTransition>
      <Layout>
        <div className="w-full bg-[#FAFAFA] min-h-screen pb-20">
          
          {/* Hero Section */}
          <section className="pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-5xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-headline-xl text-headline-xl-mobile md:text-6xl lg:text-7xl text-gray-900 leading-tight mb-6"
            >
              Built for Bharat, <br className="hidden md:block"/> Not Just the Big Cities
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-body-lg text-body-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              650+ districts. 800+ million people. Yet when it comes to discovering local events, they're invisible online. StageMap is fixing that.
            </motion.p>

            {/* Stat Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left"
            >
              <div className="bg-surface-container-lowest border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div className="text-4xl font-bold text-gray-900 mb-2">640</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Districts in India</div>
              </div>
              <div className="bg-surface-container-lowest border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div className="text-4xl font-bold text-gray-900 mb-2">8</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Have proper event platforms</div>
              </div>
              <div className="bg-primary-container border border-primary-fixed p-6 rounded-2xl shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">632</div>
                <div className="text-sm font-semibold text-primary uppercase tracking-wider">That StageMap is built for</div>
              </div>
            </motion.div>
          </section>

          {/* Core Content Sections */}
          <section className="px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto flex flex-col gap-12 md:gap-16">
            
            {/* The Problem */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border-l-4 border-l-[#ef4444]">
              <h2 className="font-headline-lg text-3xl text-gray-900 mb-6">What's Missing Today</h2>
              <ul className="space-y-4 text-gray-700 font-body-lg text-lg">
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">📍</span>
                  <span>Other apps only list ticketed, commercial events in major metros</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">🎓</span>
                  <span>College fests, inter-school competitions, local cultural nights get zero online visibility</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">📢</span>
                  <span>Event organizers in tier-2/3 cities rely on WhatsApp forwards and Instagram stories that disappear in 24 hours</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">🗺️</span>
                  <span>There is no map-based event discovery for cities like Haldwani, Rudrapur, Bareilly, Kashipur, Rampur</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">🎟️</span>
                  <span>Local talent — musicians, artists, chefs, athletes — perform to empty seats because no one knew the event existed</span>
                </li>
              </ul>
            </div>

            {/* Our Solution */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border-l-4 border-l-[#7c3aed]">
              <h2 className="font-headline-lg text-3xl text-gray-900 mb-6">What StageMap Does Differently</h2>
              <ul className="space-y-4 text-gray-700 font-body-lg text-lg">
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">✅</span>
                  <span>Anyone can post an event for free — student, NGO, college club, local organizer</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">✅</span>
                  <span>AI-powered event creation — just type a rough idea, Gemini structures it for you</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">✅</span>
                  <span>Map-based discovery — find events within 10, 25, or 50km of where you are</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">✅</span>
                  <span>No commercial gatekeeping — no listing fees, no metro-only bias</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">🚩</span>
                  <span>Community-powered reporting — 7 reports triggers an automatic review flag</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">✅</span>
                  <span>Admin-verified events get a trust badge — so attendees always know what's real</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">✅</span>
                  <span>Proof of attendance — RSVP and get a verified digital entry pass with a unique QR code</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">✅</span>
                  <span>Built mobile-first for mid-range Android devices common in tier-2/3 India</span>
                </li>
              </ul>
            </div>

            {/* Where We're Going */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border-l-4 border-l-[#10b981]">
              <h2 className="font-headline-lg text-3xl text-gray-900 mb-6">Where We're Going</h2>
              <ul className="space-y-4 text-gray-700 font-body-lg text-lg">
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">🌐</span>
                  <span>Every district in India has a live, browsable event feed</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">🤝</span>
                  <span>Local organizers get real RSVP data and reach — not just WhatsApp guesses</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">🏅</span>
                  <span>Students build a verified event portfolio — competitions attended, certificates earned</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">📡</span>
                  <span>Offline-capable PWA so events load even on slow 4G connections</span>
                </li>
                <li className="flex gap-4">
                  <span className="shrink-0 text-2xl">🇮🇳</span>
                  <span>India's first community-driven hyperlocal event layer — built by the people, for the people</span>
                </li>
              </ul>
            </div>

          </section>

          {/* Closing Quote */}
          <section className="px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto mt-20 text-center">
            <h2 className="font-headline-lg text-3xl md:text-5xl text-primary leading-tight font-medium mb-10">
              "Other apps focus on major cities. The rest of the world has thousands of communities. StageMap serves the rest."
            </h2>
            <Link 
              to="/explore"
              className="inline-flex items-center gap-2 bg-primary text-white font-headline-sm text-lg px-8 py-4 rounded-full shadow-md hover:bg-primary/90 transition-transform active:scale-95"
            >
              Start Exploring →
            </Link>
          </section>

        </div>
      </Layout>
    </PageTransition>
  )
}
