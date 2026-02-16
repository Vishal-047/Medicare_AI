"use client";

export default function AccountLoginHelp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#174AE6] py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-extrabold mb-4">Account & Login Help</h1>
        <p className="text-xl mb-8">Signing in, resetting passwords, and account settings</p>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow p-8 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Common Solutions</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-3">
            <li><span className="font-medium">Signing In:</span> Enter your registered email and password on the login page. Use the &apos;Sign in&apos; button to access your account.</li>
            <li><span className="font-medium">Forgot Password:</span> Click &apos;Forgot Password&apos; on the login page and follow the instructions sent to your email to reset your password.</li>
            <li><span className="font-medium">Account Settings:</span> Update your profile, change your password, or manage notification preferences in the &apos;Account Settings&apos; section.</li>
            <li><span className="font-medium">Account Security:</span> Enable two-factor authentication for added security.</li>
            <li><span className="font-medium">Contact Support:</span> If you have trouble accessing your account, contact support through the Help Center.</li>
          </ul>
          <div>
            <h3 className="text-xl font-semibold mt-8 mb-4">Popular Questions</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>How do I create a Medicare-AI account?</li>
              <li>I forgot my password — how can I reset it?</li>
              <li>How to change my email or phone number?</li>
              <li>How to delete my account?</li>
              <li>What to do if I didn&apos;t receive the OTP?</li>
              <li>Why can&apos;t I log in to my account?</li>
              <li>How to set up two-factor authentication?</li>
              <li>Can I use my Google account to sign in?</li>
              <li>How do I verify my identity?</li>
              <li>How to change my profile photo?</li>
              <li>Can I manage multiple profiles under one login?</li>
              <li>What should I do if my account is locked?</li>
              <li>How to update my contact preferences?</li>
              <li>I&apos;m getting unusual login alerts — what now?</li>
              <li>How do I view or edit my health information?</li>
              <li>How to manage saved doctors or favorite clinics?</li>
              <li>How do I update insurance or government ID info?</li>
              <li>How do I change my password?</li>
              <li>Can I log in on multiple devices?</li>
              <li>How to reactivate a deactivated account?</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 