"use client"
import React, { useState } from "react"
import { Linkedin, Instagram, Github } from "lucide-react"

const teamMembers = [
  {
    name: "Vishal Singh",
    role: "Full Stack Developer",
    bio: "Full-stack developer skilled in building seamless websites",
    image: "https://media.licdn.com/dms/image/v2/D5603AQEULGxiDhmGeA/profile-displayphoto-shrink_800_800/B56ZZj6Py_GQAo-/0/1745432937310?e=1756339200&v=beta&t=44_983aE0hLu92cFHfsZ1xyY8ysICL4fC1-RbRy9k0c",
    linkedin: "https://www.linkedin.com/in/vishal0407/",
    instagram: "https://instagram.com/ayesha.sharma",
    github: "https://github.com/Vishal-047",
    resume: "/resumes/ayesha-sharma.pdf"
  },
  {
    name: "Karnvendra Singh",
    role: "Full Stack Developer",
    bio: "Specialist in AI-driven diagnostics and healthcare automation.",
    image: "https://media.licdn.com/dms/image/v2/D5603AQE2FTA5PvKViw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709735272153?e=1756339200&v=beta&t=SdVxmY5lQmPPWja9nK1-Jlt5esURKgdjhAeSIshcXbc",
    linkedin: "https://linkedin.com/in/rahul-mehta",
    instagram: "https://instagram.com/rahul.mehta",
    github: "http://github.com/Karnvendrasingh",
    resume: "/resumes/rahul-mehta.pdf"
  },
  {
    name: "Rajeev Ranjan",
    role: "Full Stack Developer",
    bio: "Passionate about building user-centric healthcare solutions.",
    image: "https://media.licdn.com/dms/image/v2/D5603AQGUN4uR4b8DFg/profile-displayphoto-shrink_800_800/B56ZW3ql6dGUAk-/0/1742543151362?e=1756339200&v=beta&t=y9rkpSgwwk2UAnlPBEpzun6rXy-y-Pxsh1Z2KV4Vnrw",
    linkedin: "https://www.linkedin.com/in/rajeev12r/",
    instagram: "https://instagram.com/priya.desai",
    github: "https://github.com/Rajeev12R",
    resume: "/resumes/priya-desai.pdf"
  },
  {
    name: "Abhishek Giri",
    role: "Full Stack Developer",
    bio: "Focuses on predictive analytics and patient data security.",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHUKNN_Z_1xcQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1693056938877?e=1756339200&v=beta&t=cTEMoq-ds1daPcwfwbtrrzUUUklVI2qcFTFfUGgQCKg",
    linkedin: "https://www.linkedin.com/in/abhishek-giri-0b442528a/",
    instagram: "https://instagram.com/vikram.singh",
    github: "https://github.com/Abhishek-long",
    resume: "/resumes/vikram-singh.pdf"
  },
]

const TeamCard = ({ member }: { member: typeof teamMembers[0] }) => {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      className="w-full h-80 perspective"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full bg-card rounded-xl shadow p-6 flex flex-col items-center backface-hidden">
          <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-200" />
          <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
          <p className="text-blue-600 font-medium mb-1">{member.role}</p>
          <p className="text-sm text-muted-foreground text-center">{member.bio}</p>
          <div className="mt-4 flex gap-3 opacity-60">
            <Linkedin />
            <Instagram />
            <Github />
          </div>
        </div>
        {/* Back Side */}
        <div className="absolute w-full h-full bg-blue-50 rounded-xl shadow flex flex-col items-center justify-center gap-4 rotate-y-180 backface-hidden">
          <span className="text-lg font-semibold text-blue-700 mb-2">Connect with {member.name.split(' ')[0]}</span>
          <div className="flex gap-6">
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 text-blue-500">
              <Linkedin size={32} />
            </a>
            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 text-pink-500">
              <Instagram size={32} />
            </a>
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 text-gray-600">
              <Github size={32} />
            </a>
          </div>
          <a
            href={member.resume}
            download
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Download Resume
          </a>
        </div>
      </div>
    </div>
  )
}

const TeamPage = () => {
  const [showForm, setShowForm] = useState(false)
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Meet Our Team</h1>
        <p className="text-lg text-muted-foreground">Passionate professionals dedicated to revolutionizing healthcare with AI and compassion.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {teamMembers.map((member, idx) => (
          <TeamCard key={idx} member={member} />
        ))}
      </div>
      {/* Join Our Team Now section */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-500 py-10 px-4 flex flex-col items-center justify-center mt-16 rounded-xl shadow-lg">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Join Our Team Now</h3>
        <p className="text-white/80 mb-4 max-w-xl text-center">We&apos;re always looking for passionate professionals to join us in revolutionizing healthcare. Explore our team and open positions!</p>
        <div className="flex gap-4">
          <a href="/team" className="px-5 py-2 rounded-full bg-white text-blue-700 font-semibold shadow hover:bg-blue-100 transition">Learn More</a>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2 rounded-full bg-blue-900 text-white font-semibold shadow hover:bg-blue-800 transition"
          >
            Get Started
          </button>
        </div>
      </div>
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h4 className="text-2xl font-bold mb-4 text-blue-700">Join Our Team</h4>
            <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full border rounded px-3 py-2" required />
              <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" required />
              <input type="tel" placeholder="Phone" className="w-full border rounded px-3 py-2" />
              <textarea placeholder="Message" className="w-full border rounded px-3 py-2" rows={3} required></textarea>
              <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition">Submit</button>
            </form>
          </div>
        </div>
      )}
      <style jsx global>{`
        .perspective {
          perspective: 1200px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}

export default TeamPage 