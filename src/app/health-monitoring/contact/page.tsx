"use client";

import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Contact Us</h1>
        <p className="text-lg text-gray-500 mb-8 text-center">We&apos;re here to help. Reach out with your questions.</p>

        {/* Support Info Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">📞 Support Info</h2>
          <div className="space-y-2 text-gray-700">
            <div><span className="font-medium">Email:</span> <a href="mailto:support@medicare.com" className="text-blue-600 hover:underline">support@medicare.com</a></div>
            <div><span className="font-medium">Phone:</span> <a href="tel:+911234567890" className="text-blue-600 hover:underline">+91-123-456-7890</a></div>
            <div><span className="font-medium">Hours:</span> Mon–Fri, 9AM–6PM</div>
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <h2 className="text-xl font-semibold mb-4">📧 Contact Form</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How can we help you?"
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Submit
            </button>
            {submitted && (
              <div className="text-green-600 text-center font-medium mt-2">Thank you! Your message has been sent.</div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
} 