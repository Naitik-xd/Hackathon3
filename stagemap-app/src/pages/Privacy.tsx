import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'

export default function Privacy() {
  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8 text-gray-700">
          <header className="text-left border-b pb-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: September 2026</p>
          </header>

          <section className="space-y-4">
            <p>
              Welcome to Stagemap ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            <div className="bg-[#FEF3C7] text-[#92400E] px-4 py-3 rounded-lg border border-[#F59E0B] font-medium text-sm">
              ⚠️ <strong>Disclaimer:</strong> This application was built for a Hackathon and is a prototype. While we try our best to protect the data, please do not share any sensitive personal information.
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Identity Data:</strong> Username and profile information.</li>
              <li><strong>Contact Data:</strong> Email address.</li>
              <li><strong>Usage Data:</strong> Events you post and RSVP details.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide, maintain, and improve our Service.</li>
              <li>To allow you to participate in interactive features like posting events.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">3. Data Security</h2>
            <p>
              Data is stored securely using Supabase (PostgreSQL). We do not sell your data or share it with unauthorized third parties.
            </p>
          </section>
        </div>
      </Layout>
    </PageTransition>
  )
}
