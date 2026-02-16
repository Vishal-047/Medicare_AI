"use client"


const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "data-we-collect", label: "Data We Collect" },
  { id: "how-we-use-your-data", label: "How We Use Your Data" },
  { id: "how-we-share-information", label: "How We Share Information" },
  { id: "your-choices-obligations", label: "Your Choices & Obligations" },
  { id: "other-important-info", label: "Other Important Information" },
  { id: "changes-to-policy", label: "Changes to This Policy" },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 py-8 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-lg max-w-3xl mx-auto">
          This Privacy Policy explains how <span className="font-semibold">Medicare-AI</span> collects, uses, and protects your
          personal and health information when you use our website, mobile experience, and AI-powered services.
        </p>
        <p className="italic text-sm mt-2">Effective Date: January 1, 2025</p>
      </header>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 py-10 px-4">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Optional summary message section */}
          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-blue-900 text-base">
              At Medicare-AI, your privacy is our top priority. We only collect the minimum information required
              to provide safe, secure and useful healthcare assistance. We do <span className="font-semibold">not</span> sell your
              data, and we use industry-standard security controls to protect it.
            </p>
          </div>

          <section id="introduction" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
            <p className="text-gray-700">
              Medicare-AI values your privacy and is dedicated to safeguarding your personal and health-related information.
              This Privacy Policy describes what data we collect, how and why we process it, with whom we may share it,
              and the choices you have. By accessing or using Medicare-AI, you agree to the practices described here.
            </p>
          </section>

          <section id="data-we-collect" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Data We Collect</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                <span className="font-medium">Account & Identity Data:</span> Name, date of birth, gender, contact details
                (email, phone), and address you provide when creating or updating your account.
              </li>
              <li>
                <span className="font-medium">Health & Medical Information:</span> Symptoms you enter into the AI assistant,
                health conditions, medications, allergies, past consultations, uploaded medical reports, lab results,
                prescriptions and any notes you choose to store.
              </li>
              <li>
                <span className="font-medium">Appointment & Provider Data:</span> Booked doctor appointments, schedules,
                providers you interact with, and related status updates.
              </li>
              <li>
                <span className="font-medium">Technical & Usage Data:</span> Log data, device information, browser type,
                IP address, approximate location, pages visited, and interactions with our platform and AI services.
              </li>
              <li>
                <span className="font-medium">Payment Data:</span> Limited billing-related details (such as masked card details or
                transaction IDs) processed via secure payment gateways like Stripe. Full card data is handled directly
                by the payment provider and not stored by us.
              </li>
              <li>
                <span className="font-medium">Cookies & Tracking:</span> We use cookies and similar technologies to remember
                your preferences, secure your sessions, and improve performance.
              </li>
            </ul>
          </section>

          <section id="how-we-use-your-data" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">How We Use Your Data</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>To provide core features such as AI-based symptom checks, report analysis, doctor discovery and appointment booking.</li>
              <li>To personalise your experience and show relevant doctors, health articles, reminders and schemes based on your profile.</li>
              <li>To process payments for any paid plans or services and send related confirmations or invoices.</li>
              <li>To communicate with you about account activity, appointments, lab results, security alerts and product updates.</li>
              <li>To monitor system performance, detect fraud or abuse, enforce our Terms of Service, and keep the platform secure.</li>
              <li>To generate anonymised or aggregated statistics that help us understand how the platform is used and improve it.</li>
            </ul>
          </section>

          <section id="how-we-share-information" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">How We Share Information</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                With doctors and healthcare providers involved in your care, only to the extent necessary to schedule or manage appointments
                or share records you explicitly choose to share.
              </li>
              <li>
                With trusted third-party vendors (such as hosting, analytics, SMS/email, payment processors and AI model providers) who
                process data on our behalf under strict contractual obligations.
              </li>
              <li>
                With government health programs or insurers where you ask us to help you check eligibility or benefits, subject to applicable law.
              </li>
              <li>
                With regulators, law enforcement, or other parties when required by law, legal process, or to protect the safety, rights,
                or property of you, us, or others.
              </li>
              <li>
                We <span className="font-semibold">do not sell</span> your personal information to third parties.
              </li>
            </ul>
          </section>

          <section id="your-choices-obligations" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Your Choices & Rights</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>You may access, update, or delete certain personal information at any time through your account settings.</li>
              <li>You may opt out of marketing communications by using the unsubscribe link in our emails or by contacting us.</li>
              <li>You can request that we delete your account, subject to legal or regulatory retention requirements.</li>
              <li>You are responsible for keeping your login credentials confidential and for promptly notifying us of any suspected misuse.</li>
            </ul>
          </section>

          <section id="other-important-info" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Other Important Information</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                <span className="font-medium">Data Security:</span> We use encryption, access controls, and secure infrastructure to
                protect your information. However, no method of transmission or storage is 100% secure.
              </li>
              <li>
                <span className="font-medium">Children&apos;s Privacy:</span> Medicare-AI is not intended for children under 16. We do not
                knowingly collect data from children. If you believe a child has provided us with information, please contact us so we can delete it.
              </li>
              <li>
                <span className="font-medium">Data Retention:</span> We retain your data for as long as your account is active or as
                needed to provide services and comply with legal obligations, resolve disputes, and enforce our agreements.
              </li>
              <li>
                <span className="font-medium">Contact for Privacy Inquiries:</span> If you have questions or requests regarding your
                privacy, please contact us at{" "}
                <a href="mailto:privacy@medicare-ai.com" className="text-blue-600 hover:underline">
                  privacy@medicare-ai.com
                </a>{" "}
                or +91-123-456-7890.
              </li>
            </ul>
          </section>

          <section id="changes-to-policy" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology or legal
              requirements. When we make material changes, we will update the &quot;Effective Date&quot; above and, where
              appropriate, notify you through the product or by email. Please review this policy periodically.
            </p>
          </section>
        </main>

        {/* Table of Contents */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Table of Contents:</h3>
            <ul className="space-y-2 text-blue-700">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="hover:underline focus:underline">
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
} 