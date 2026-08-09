import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'

export default function Guidelines() {
  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Community Guidelines</h1>
            <div className="bg-[#FEF3C7] text-[#92400E] px-4 py-3 rounded-lg border border-[#F59E0B] font-medium text-sm text-left">
              ⚠️ Hackathon prototype — not a real-world platform
            </div>
          </header>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">✅ Do:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
              <li>Post real, genuine events happening in your city</li>
              <li>Provide accurate date, time and venue information</li>
              <li>Use appropriate category tags</li>
              <li>Respect other community members</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">❌ Don't:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
              <li>Post fake, misleading or duplicate events</li>
              <li>Use the platform for spam or self-promotion unrelated to events</li>
              <li>Impersonate other organizers or institutions</li>
              <li>Post events with wrong dates or locations intentionally</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reporting:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-2">
              <li>Use the 🚩 Report button on any event that violates these guidelines</li>
              <li>Events with 7+ reports are automatically flagged for review</li>
              <li>Verified events (✅) have been reviewed by a StageMap admin</li>
            </ul>
          </section>

          <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-6 rounded-r-lg mt-4">
            <h3 className="font-bold text-[#92400E] mb-2">Disclaimer</h3>
            <p className="text-[#92400E] text-sm leading-relaxed">
              These guidelines are for demonstration purposes as part of the HackDevengers 10 Hackathon. This is not a legally binding document.
            </p>
          </div>
        </div>
      </Layout>
    </PageTransition>
  )
}
