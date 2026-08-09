import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'
import { Mail } from 'lucide-react'

export default function Support() {
  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Support</h1>
            <p className="text-xl text-gray-500 mb-6">Need help? We're here.</p>
            <div className="bg-[#FEF3C7] text-[#92400E] px-4 py-3 rounded-lg border border-[#F59E0B] font-medium text-sm text-left">
              ⚠️ This is a hackathon prototype. Support is limited.
            </div>
          </header>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] mb-2">
              <Mail size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
            <p className="text-gray-500">For any questions, issues or feedback:</p>
            <a href="mailto:naitik.270810@outlook.com?subject=StageMap Support" className="text-2xl md:text-3xl font-bold text-[#7C3AED] hover:underline break-all">
              naitik.270810@outlook.com
            </a>
            <a 
              href="mailto:naitik.270810@outlook.com?subject=StageMap Support"
              className="mt-4 px-8 py-3 bg-[#7C3AED] text-white font-semibold rounded-full hover:bg-[#6D28D9] transition-colors flex items-center gap-2"
            >
              ✉️ Send Email
            </a>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Issues</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">🔐 Can't sign in</h3>
                <p className="text-gray-600 mt-1 ml-7">Make sure you're using a valid email. Google OAuth coming soon.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">📍 My city isn't in the list</h3>
                <p className="text-gray-600 mt-1 ml-7">Use the manual text field or select the nearest city</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">🗓️ Event not showing</h3>
                <p className="text-gray-600 mt-1 ml-7">Events that have passed are automatically hidden</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">🚩 I see a fake event</h3>
                <p className="text-gray-600 mt-1 ml-7">Use the Report button on the event page</p>
              </div>
            </div>
          </section>

          <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-6 rounded-r-lg mt-8">
            <h3 className="font-bold text-[#92400E] mb-2">Disclaimer</h3>
            <p className="text-[#92400E] text-sm leading-relaxed">
              StageMap was built for HackDevengers 10 Hackathon by Devengers. This support page is part of the prototype submission.
            </p>
          </div>
        </div>
      </Layout>
    </PageTransition>
  )
}
