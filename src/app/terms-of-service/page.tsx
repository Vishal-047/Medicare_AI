"use client"

import Link from "next/link";

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "description", label: "Description of Services" },
  { id: "user-responsibilities", label: "User Responsibilities" },
  { id: "account-registration", label: "Account Registration" },
  { id: "privacy-policy", label: "Privacy Policy Reference" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "disclaimers", label: "Disclaimers & Limitation of Liability" },
  { id: "termination", label: "Termination of Use" },
  { id: "changes", label: "Changes to Terms" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact Information" },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 py-8 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-lg max-w-3xl mx-auto">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Medicare-AI platform,
          including all AI features, medical tools, and related services. By using Medicare-AI, you agree to be bound by
          these Terms.
        </p>
        <p className="italic text-sm mt-2">Effective Date: January 1, 2025</p>
      </header>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 py-10 px-4">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <section id="acceptance" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing, browsing, or using Medicare-AI, you confirm that you have read, understood, and agree to be
              bound by these Terms and our Privacy Policy. If you do not agree, you must not use the platform.
            </p>
          </section>

          <section id="description" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Description of Services</h2>
            <p className="text-gray-700">
              Medicare-AI provides digital tools to help you better understand your health, including AI-based symptom
              analysis, medical report interpretation, doctor discovery, appointment booking, and secure storage of your
              medical documents. We do not provide in-person medical services; instead, we connect you with healthcare
              providers and give you AI-generated insights to discuss with a qualified doctor.
            </p>
          </section>

          <section id="user-responsibilities" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">User Responsibilities</h2>
            <p className="text-gray-700">
              You agree to provide accurate, current, and complete information when creating an account or using the
              services. You are responsible for all activity that occurs under your account and for keeping your
              credentials secure. You must not misuse the platform, including attempting unauthorised access, interfering
              with security features, scraping data, or using the services for unlawful, harmful, or fraudulent purposes.
            </p>
          </section>

          <section id="account-registration" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Account Registration</h2>
            <p className="text-gray-700">
              To use certain features, you must create an account and provide basic information. You represent that you are
              at least 18 years old, or that you have the consent and supervision of a parent or legal guardian if you are
              between 16 and 18. You agree to notify us immediately of any unauthorised use of your account.
            </p>
          </section>

          <section id="privacy-policy" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Privacy Policy Reference</h2>
            <p className="text-gray-700">
              Your use of Medicare-AI is also governed by our{" "}
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              , which explains how we collect, use, and safeguard your personal and health information. By using the
              services, you consent to our data practices as described there.
            </p>
          </section>

          <section id="intellectual-property" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
            <p className="text-gray-700">
              All software, text, graphics, logos, icons, trademarks, and other content on Medicare-AI are owned by us or
              our licensors and are protected by applicable intellectual property laws. You may use the platform only for
              your personal, non-commercial use. You may not copy, modify, reverse engineer, sell, or distribute any part
              of the platform without our prior written consent.
            </p>
          </section>

          <section id="disclaimers" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Medical & AI Disclaimers; Limitation of Liability</h2>
            <p className="text-gray-700 mb-3">
              Medicare-AI provides AI-generated information and suggestions that are intended for educational and
              informational purposes only. The platform is <span className="font-semibold">not</span> a substitute for
              professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare
              provider with any questions you may have regarding a medical condition and never disregard professional
              advice because of something you have read on Medicare-AI.
            </p>
            <p className="text-gray-700">
              To the fullest extent permitted by law, Medicare-AI and its affiliates shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of data, profits, or revenues, whether
              incurred directly or indirectly, arising from your use of or inability to use the services.
            </p>
          </section>

          <section id="termination" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Termination of Use</h2>
            <p className="text-gray-700">
              We may suspend or terminate your access to all or part of the services at any time, with or without notice,
              if we reasonably believe you have violated these Terms, engaged in fraudulent or abusive activity, or if we
              need to do so for security, legal, or operational reasons. You may also stop using the services at any time.
            </p>
          </section>

          <section id="changes" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these Terms from time to time to reflect changes in our services, legal requirements, or
              business practices. When we make material changes, we will update the &quot;Effective Date&quot; above and
              may provide additional notice. Your continued use of Medicare-AI after the updated Terms become effective
              constitutes your acceptance of them.
            </p>
          </section>

          <section id="governing-law" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
            <p className="text-gray-700">These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts in Mumbai, India.</p>
          </section>

          <section id="contact" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
            <p className="text-gray-700">If you have any questions about these Terms of Service, please contact us at:</p>
            <ul className="list-none pl-0 text-gray-700 mt-2">
              <li>Email: <a href="mailto:tos@medicare-ai.com" className="text-blue-600 hover:underline">tos@medicare-ai.com</a></li>
              <li>Phone: +91-123-456-7890</li>
              <li>Address: 123 Health Lane, Mumbai, India</li>
            </ul>
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