import { Link, useLocation } from 'react-router-dom'
import { Compass, Calendar, Bookmark, User } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()
  
  const navLinks = [
    { name: 'Discover', path: '/explore', icon: Compass },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Saved', path: '/saved', icon: Bookmark },
    { name: 'Profile', path: '/profile', icon: User }
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface md:hidden shadow-[0px_-2px_10px_rgba(0,0,0,0.05)]">
      {navLinks.map((link) => {
        const isActive = location.pathname.includes(link.path)
        const Icon = link.icon
        
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-colors ${
              isActive 
                ? 'bg-primary-container text-on-primary-container scale-90 transition-transform duration-200' 
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <Icon size={20} />
            <span className="font-label-md text-label-md mt-1">{link.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
