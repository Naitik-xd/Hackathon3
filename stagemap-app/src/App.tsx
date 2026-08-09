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
import TicketVerify from './pages/TicketVerify'

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
        <Route path="/post" element={<PostEvent />} />
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
