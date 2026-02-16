"use client";

export default function UsingFeatures() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#174AE6] py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-extrabold mb-4">Using Medicare-AI Features</h1>
        <p className="text-xl mb-8">How to use the app's features like health charts, doctor finder, and file upload</p>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow p-8 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Common Solutions</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-3">
            <li><span className="font-medium">Health Charts:</span> Track your health metrics over time using the Health Monitoring dashboard.</li>
            <li><span className="font-medium">Doctor Finder:</span> Use the &apos;Find Doctors&apos; feature to search for healthcare professionals by specialty, location, or rating.</li>
            <li><span className="font-medium">File Upload:</span> Securely upload and manage your medical documents in the &apos;Medical Records&apos; section.</li>
            <li><span className="font-medium">Notifications:</span> Enable notifications to receive reminders and important updates.</li>
            <li><span className="font-medium">Support:</span> For help with features, visit the Help Center or contact support.</li>
          </ul>
          <div>
            <h3 className="text-xl font-semibold mt-8 mb-4">Popular Questions</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>How to use the doctor finder tool?</li>
              <li>How to upload and share medical reports?</li>
              <li>How to view health analytics/charts?</li>
              <li>What is the Typewriter feature used for?</li>
              <li>How to toggle between dark and light themes?</li>
              <li>How to access the AI chat or virtual assistant?</li>
              <li>How to use the appointment popover form?</li>
              <li>Can I sort doctors by rating or fee?</li>
              <li>What is the "File Upload" feature?</li>
              <li>How to filter doctors by specialization or gender?</li>
              <li>How to bookmark favorite doctors?</li>
              <li>Can I access past consultation summaries?</li>
              <li>What is the "Health Chart" feature and how to use it?</li>
              <li>Can I share data with family or caretakers?</li>
              <li>What notifications will I receive?</li>
              <li>How to enable or disable AI suggestions?</li>
              <li>How to switch language settings in the app?</li>
              <li>Where can I find app tutorials?</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 