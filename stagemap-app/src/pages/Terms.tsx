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
            <h2 className="text-2xl font-semibold text-gray-900">1. Acknowledgment</h2>
            <p>
              These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
            </p>
            <p>
              Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">2. User Content</h2>
            <p>
              Our Service allows You to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that You post to the Service, including its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting Content to the Service, You grant Us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of Your rights to any Content You submit, post or display on or through the Service and You are responsible for protecting those rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">3. Prohibited Uses</h2>
            <p>You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
              <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">4. "AS IS" and "AS AVAILABLE" Disclaimer</h2>
            <p>
              The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">5. Limitation of Liability</h2>
            <p>
              Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">6. Links to Other Websites</h2>
            <p>
              Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">7. Changes to These Terms and Conditions</h2>
            <p>
              We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at Our sole discretion. By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms.
            </p>
          </section>
        </div>
      </Layout>
    </PageTransition>
  )
}
