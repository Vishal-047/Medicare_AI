"use client"

import React from "react";
import { MessageCircle, Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: <Facebook className="w-10 h-10 text-blue-600" />, label: "Facebook", href: "https://facebook.com" },
  { icon: <Twitter className="w-10 h-10 text-gray-700" />, label: "X", href: "https://x.com" },
  { icon: <Instagram className="w-10 h-10 text-pink-500" />, label: "Instagram", href: "https://instagram.com" },
  { icon: <Linkedin className="w-10 h-10 text-blue-700" />, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: <Youtube className="w-10 h-10 text-red-600" />, label: "YouTube", href: "https://youtube.com" },
  { icon: <Phone className="w-10 h-10 text-green-600" />, label: "WhatsApp", href: "https://wa.me/1234567890" },
  { icon: <Mail className="w-10 h-10 text-orange-600" />, label: "Email", href: "mailto:support@medicare-ai.com" },
  { icon: <MessageCircle className="w-10 h-10 text-red-600" />, label: "Support & Chat" },
];

export default function ContactUs() {
  const [showChat, setShowChat] = React.useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (showChat && chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showChat]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header */}
      <div className="bg-blue-700 py-16 px-4 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Contact us</h1>
        <p className="text-lg mb-6">Sign in so we can get you the right help and support.</p>
        <div className="flex flex-col items-center gap-2">
          <button className="bg-white text-blue-700 font-semibold px-8 py-2 rounded shadow hover:bg-blue-50 transition mb-1">Sign in</button>
          <Link href="#" className="underline text-sm hover:text-blue-200">Can&apos;t sign in</Link>
        </div>
      </div>

      {/* Social Media & Contact Grid Section */}
      <div className="bg-white max-w-5xl mx-auto rounded-xl shadow p-8 -mt-10 relative z-10">
        <h2 className="text-2xl font-semibold text-center mb-2">Connect with us</h2>
        <p className="text-gray-600 text-center mb-8">Reach out to us on social media or email for support and updates.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              {feature.label === "Support & Chat" ? (
                <button
                  onClick={() => setShowChat(true)}
                  className="bg-gray-100 rounded-full p-4 mb-2 flex items-center justify-center shadow hover:bg-blue-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Open Support & Chat"
                >
                  {feature.icon}
                </button>
              ) : (
                <a
                  href={feature.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 rounded-full p-4 mb-2 flex items-center justify-center shadow hover:bg-blue-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={feature.label}
                >
                  {feature.icon}
                </a>
              )}
              <span className="text-base font-medium text-gray-800 text-center">{feature.label}</span>
            </div>
          ))}
        </div>
        <div className="text-blue-700 mt-8 text-center">
          <Link href="#" className="hover:underline font-medium">Show expanded list of services</Link>
        </div>
      </div>
      {/* Support & Chat Section */}
      {showChat && (
        <div ref={chatRef} id="support-chat" className="max-w-2xl mx-auto mt-12 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="text-red-600"><MessageCircle className="inline w-6 h-6" /></span>Support & Chat</h2>
          <SupportChat />
        </div>
      )}
    </div>
  );
}

// SupportChat component
function SupportChat() {
  const [messages, setMessages] = React.useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", subject: "", message: "", file: null });
  const [submitted, setSubmitted] = React.useState(false);
  const [queryId, setQueryId] = React.useState("");

  // Predefined Q&A
  const faqs = [
    { q: /hours|timing|open/i, a: "Our support is available Mon–Fri, 9AM–6PM." },
    { q: /reset.*password|forgot.*password/i, a: "To reset your password, click 'Forgot Password' on the login page and follow the instructions." },
    { q: /book.*appointment/i, a: "To book an appointment, go to 'Find Doctors', select a doctor, and choose a time slot." },
    { q: /contact.*doctor/i, a: "You can contact your doctor via the chat option in your appointment details." },
    { q: /upload.*file|medical.*document/i, a: "Go to 'Medical Records' to upload and manage your documents." },
    { q: /cancel.*appointment/i, a: "To cancel, visit 'My Appointments', select the appointment, and click 'Cancel'." },
    { q: /privacy|data.*secure/i, a: "Your data is encrypted and stored securely. Read our Privacy Policy for more info." },
    { q: /payment|refund/i, a: "For payments and refunds, visit the 'Billing & Payments' section or contact support." },
  ];

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    // Check if input matches a basic FAQ
    const found = faqs.find(f => f.q.test(input));
    if (found) {
      setTimeout(() => setMessages(msgs => [...msgs, { from: "bot", text: found.a }]), 500);
      setInput("");
    } else {
      // Complex query: show form
      setTimeout(() => setShowForm(true), 500);
    }
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const input = e.target as HTMLInputElement;
      setForm(f => ({ ...f, [name]: input.files && input.files.length > 0 ? input.files[0] : null }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Generate random 6-char query ID
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setQueryId(id);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-lg font-semibold mb-2">Thank you! Your query is under process.</div>
        <div className="text-gray-700">Query ID: <span className="font-mono text-blue-700">{queryId}</span></div>
        <div className="text-gray-500 mt-2">You will receive a response shortly.</div>
      </div>
    );
  }

  return (
    <div>
      {/* Chat UI */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-72 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === "bot" ? "text-left" : "text-right"}>
            <span className={msg.from === "bot" ? "inline-block bg-blue-100 text-blue-900 px-3 py-2 rounded-lg" : "inline-block bg-blue-600 text-white px-3 py-2 rounded-lg"}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      {!showForm ? (
        <form className="flex gap-2" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your question..."
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition">Send</button>
        </form>
      ) : (
        <form className="space-y-4 mt-4" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input name="name" type="text" required value={form.name} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" type="email" required value={form.email} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input name="subject" type="text" required value={form.subject} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea name="message" required value={form.message} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">File Upload (optional)</label>
            <input name="file" type="file" onChange={handleFormChange} className="w-full" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Submit Query</button>
        </form>
      )}
    </div>
  );
} 