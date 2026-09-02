import PageTransition from '../components/PageTransition'
import Layout from '../components/Layout'

export default function Terms() {
  return (
    <PageTransition>
      <Layout>
        <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8 text-gray-700">
          <header className="text-left border-b pb-6">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Terms and Conditions</h1>
            <p className="text-sm text-gray-500">Last updated: September 2026</p>
          </header>

          <section className="space-y-4">
            <p>
              Please read these terms and conditions carefully before using Our Service.
            </p>
            <div className="bg-[#FEF3C7] text-[#92400E] px-4 py-3 rounded-lg border border-[#F59E0B] font-medium text-sm">
              ⚠️ <strong>Disclaimer:</strong> This application was built for a Hackathon and is a prototype. It is not intended for real-world or commercial use.
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">1. Use of Service</h2>
            <p>
              By using our Service, you agree to these terms. This is a hackathon prototype and should be used as such.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">2. User Content</h2>
            <p>
              You are responsible for any events or information you post. Please ensure your content is appropriate and lawful.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">3. Prohibited Uses</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Do not violate any laws or regulations.</li>
              <li>Do not post harmful, spammy, or deceptive content.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">4. Disclaimer & Liability</h2>
            <p>
              The Service is provided "AS IS" without warranties of any kind. We hold no liability for any issues arising from the use of this prototype.
            </p>
          </section>
        </div>
      </Layout>
    </PageTransition>
  )
}
