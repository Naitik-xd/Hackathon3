import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#F3F4F6] py-8 mt-auto z-10 relative">
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <Link to="/vision" className="text-[#6B7280] text-[14px] hover:text-[#7C3AED] transition-colors">About</Link>
          <Link to="/guidelines" className="text-[#6B7280] text-[14px] hover:text-[#7C3AED] transition-colors">Guidelines</Link>
          <Link to="/privacy" className="text-[#6B7280] text-[14px] hover:text-[#7C3AED] transition-colors">Privacy Policy</Link>
          <Link to="/support" className="text-[#6B7280] text-[14px] hover:text-[#7C3AED] transition-colors">Support</Link>
        </div>
        <div className="text-[#9CA3AF] text-xs mt-4">
          Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a> contributors
        </div>
      </div>
    </footer>
  )
}
