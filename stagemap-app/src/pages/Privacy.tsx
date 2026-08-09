import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'

export default function Privacy() {
  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
            <div className="bg-[#FEF3C7] text-[#92400E] px-4 py-3 rounded-lg border border-[#F59E0B] font-medium text-sm text-left">
              ⚠️ This app was built for HackDevengers Hackathon and is not intended for real-world use.
            </div>
          </header>

          <section className="border-l-4 border-[#7C3AED] pl-6 py-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What we collect:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Email address (if you sign in)</li>
              <li>Events you post and RSVP to</li>
              <li>City you set in your profile</li>
            </ul>
          </section>

          <section className="border-l-4 border-[#7C3AED] pl-6 py-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What we don't do:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>We do not sell your data</li>
              <li>We do not share your data with third parties</li>
              <li>We do not store payment information (the app is free)</li>
            </ul>
          </section>

          <section className="border-l-4 border-[#7C3AED] pl-6 py-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data storage:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>All data is stored in Supabase (PostgreSQL) with standard security practices</li>
              <li>This is a hackathon prototype — do not store sensitive personal information</li>
            </ul>
          </section>

          <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-6 rounded-r-lg mt-8">
            <h3 className="font-bold text-[#92400E] mb-2">Disclaimer</h3>
            <p className="text-[#92400E] text-sm leading-relaxed">
              This application was created solely for the HackDevengers 10 Hackathon organized by Devengers. It is a prototype and proof-of-concept only. It is not a real commercial product and should not be used as one. No legal liability is assumed.
            </p>
            <p className="text-[#92400E] text-sm font-bold mt-4">
              Built by: Naitik | HackDevengers 10
            </p>
          </div>
        </div>
      </Layout>
    </PageTransition>
  )
}
