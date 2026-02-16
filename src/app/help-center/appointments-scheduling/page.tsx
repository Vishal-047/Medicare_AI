"use client";

export default function AppointmentsScheduling() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#174AE6] py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-extrabold mb-4">Appointments & Scheduling</h1>
        <p className="text-xl mb-8">How to book, reschedule, or cancel appointments</p>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow p-8 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Common Solutions</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-3">
            <li><span className="font-medium">Booking an Appointment:</span> Go to the &apos;Find Doctors&apos; section, select your preferred doctor, choose an available time slot, and confirm your booking.</li>
            <li><span className="font-medium">Rescheduling:</span> Visit &apos;My Appointments&apos;, select the appointment you wish to change, and choose a new date and time.</li>
            <li><span className="font-medium">Cancelling:</span> In &apos;My Appointments&apos;, select the appointment and click &apos;Cancel&apos;. Confirm your cancellation to free up the slot.</li>
            <li><span className="font-medium">Appointment Reminders:</span> Enable notifications in your profile settings to receive reminders for upcoming appointments.</li>
            <li><span className="font-medium">Contact Support:</span> If you face issues, reach out via the Help Center contact form for assistance.</li>
          </ul>
          <div>
            <h3 className="text-xl font-semibold mt-8 mb-4">Popular Questions</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>How do I book a new appointment with a doctor?</li>
              <li>Can I schedule appointments for family members?</li>
              <li>How to reschedule an appointment?</li>
              <li>How to cancel an appointment?</li>
              <li>How do I know if my appointment is confirmed?</li>
              <li>What happens if I miss my appointment?</li>
              <li>Are video consultations available?</li>
              <li>How do I choose the best doctor for my symptoms?</li>
              <li>Can I set appointment reminders?</li>
              <li>How to check doctor availability?</li>
              <li>What do I need to carry for a physical appointment?</li>
              <li>How can I contact the doctor before my visit?</li>
              <li>Can I book multiple appointments at once?</li>
              <li>How to filter doctors by specialization?</li>
              <li>How long are the appointment durations?</li>
              <li>Can I request a second opinion?</li>
              <li>What if the doctor cancels the appointment?</li>
              <li>How is telemedicine handled?</li>
              <li>How do emergency appointments work?</li>
              <li>Can I leave a review after my appointment?</li>
              <li>How do I change the location of my visit?</li>
              <li>How secure is my health data during bookings?</li>
              <li>Can I upload medical files for the doctor to review?</li>
              <li>Is there a limit on the number of appointments?</li>
              <li>What to do if the appointment page doesn&apos;t load?</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 