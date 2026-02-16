"use client";
import { Activity, Mail, Phone, MapPin } from "lucide-react";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Activity className="w-8 h-8 text-blue-400 mr-3" />
              <span className="text-2xl font-bold">MediCare AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Revolutionizing healthcare with AI-powered medical assistance and comprehensive care solutions.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">in</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/ai-analysis" className="hover:text-white transition-colors">AI Medical Analysis</Link></li>
              <li><Link href="/speech-analysis" className="hover:text-white transition-colors">Speech Recognition</Link></li>
              <li><Link href="/find-care" className="hover:text-white transition-colors">Find Healthcare</Link></li>
              <li><Link href="/medical-records" className="hover:text-white transition-colors">Medical Records</Link></li>
              <li><Link href="/health-monitoring" className="hover:text-white transition-colors">Health Monitoring</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <span>+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <span>support@medicareai.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3" />
                <span>123 Healthcare Ave, Medical City, Mumbai</span>
              </div>
            </div>
            <div className="mt-6">
              <a href="/team" className="text-lg font-semibold text-blue-400 hover:underline cursor-pointer block">Let&apos;s Meet Our Team</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MediCare AI. All rights reserved. </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
