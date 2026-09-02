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
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, events you post, and RSVP details.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our Service.</li>
              <li>To notify you about changes to our Service.</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so.</li>
              <li>To provide customer support.</li>
              <li>To gather analysis or valuable information so that we can improve our Service.</li>
              <li>To monitor the usage of our Service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">3. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. All data is stored securely using industry-standard database practices (Supabase / PostgreSQL).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">4. Third-Party Links</h2>
            <p>
              This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">5. Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
        </div>
      </Layout>
    </PageTransition>
  )
}
