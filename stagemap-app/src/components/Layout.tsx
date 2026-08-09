import { ReactNode } from 'react'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col font-body-md">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
