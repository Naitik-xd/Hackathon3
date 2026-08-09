import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import ExploreEvents from './pages/ExploreEvents'
import MapView from './pages/MapView'
import PostEvent from './pages/PostEvent'
import EventDetail from './pages/EventDetail'
import MyProfile from './pages/MyProfile'
import SavedEvents from './pages/SavedEvents'
import Auth from './pages/Auth'
import CalendarView from './pages/CalendarView'
import ProtectedRoute from './components/ProtectedRoute'
import MyTickets from './pages/MyTickets'
import Vision from './pages/Vision'
import React from 'react'
import TicketVerify from './pages/TicketVerify'
import Privacy from './pages/Privacy'
import Guidelines from './pages/Guidelines'
import Support from './pages/Support'

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  state = { hasError: false, error: null as any }
  static getDerivedStateFromError(error: any) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Something went wrong loading this page.</p>
        <pre style={{ fontSize: 12, color: 'red' }}>{this.state.error?.message}</pre>
      </div>
    )
    return this.props.children
  }
}

function ScrollToTop() {
  const { pathname } = useLocation()
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <>
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: '#1D1A24',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '12px 20px',
          fontSize: '14px',
          fontFamily: 'Plus Jakarta Sans'
        },
        success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#FF4D4D', secondary: '#fff' } }
      }} />
      <ScrollToTop />
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/explore" element={<ExploreEvents />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/ticket-verify/:eventId/:userId" element={<TicketVerify />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/saved" element={<SavedEvents />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/post" element={<ErrorBoundary><PostEvent /></ErrorBoundary>} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/support" element={<Support />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        } />
        <Route path="/tickets" element={
          <ProtectedRoute>
            <MyTickets />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  )
}

export default App
