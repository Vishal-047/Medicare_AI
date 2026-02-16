"use client"
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Brain, MapPin, FileText, Users, Activity } from "lucide-react"
import FeatureCard from "@/components/FeatureCard"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import React from "react"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Placeholder for GridBackground
const GridBackground = () => (
  <div
    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-black opacity-30 pointer-events-none"
    aria-hidden
  />
)

// New, diverse testimonials with random Unsplash avatars
const allTestimonials = [
  {
    quote:
      "Managing my parents' medical records used to be a nightmare. This platform has made it incredibly simple.",
    name: "Priya S.",
    role: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "The health monitoring feature is fantastic. It helps me keep track of my vitals and stay proactive about my health.",
    name: "Rajesh V.",
    role: "Accountant",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "A beautifully designed and incredibly useful tool. It feels like the future of personal health management.",
    name: "Ananya G.",
    role: "Student",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote:
      "Uploading my lab reports and getting an easy-to-read summary saved me so much confusion. Highly recommend!",
    name: "Vikram M.",
    role: "Architect",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    quote:
      "The AI symptom analysis gave me peace of mind and pointed me to the right specialist. A game-changer!",
    name: "Sunita R.",
    role: "Teacher",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    quote:
      "I found a great doctor nearby in minutes. The detailed information helped me make a confident choice.",
    name: "Amit K.",
    role: "Marketing Manager",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
  },
  {
    quote:
      "The reminders for medication and appointments are so helpful for my elderly parents.",
    name: "Fatima Z.",
    role: "Homemaker",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    quote:
      "I love how secure and private my data feels. The platform is easy to use and trustworthy.",
    name: "John D.",
    role: "Lawyer",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    quote:
      "The support team is responsive and caring. I feel truly looked after as a user.",
    name: "Meera P.",
    role: "Nurse",
    avatar: "https://randomuser.me/api/portraits/women/36.jpg",
  },
]

// Split testimonials into 3 columns
const testimonials1 = allTestimonials.filter((_, i) => i % 3 === 0)
const testimonials2 = allTestimonials.filter((_, i) => i % 3 === 1)
const testimonials3 = allTestimonials.filter((_, i) => i % 3 === 2)

// Clean, elegant card design
const TestimonialScroller = ({
  testimonials,
  duration = "30s",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  testimonials: any[]
  duration?: string
}) => {
  const items = [...testimonials, ...testimonials]
  return (
    <div className="testimonial-scroll-outer">
      <div
        className="testimonial-scroll-inner"
        style={{ animationDuration: duration }}
      >
        {items.map((t, i) => (
          <Card
            key={i}
            className="
              flex-shrink-0 w-80 mx-auto mb-8 px-8 pt-10 pb-8
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              rounded-2xl shadow-md
              relative
              flex flex-col items-center
              transition-transform duration-300 hover:scale-105 hover:shadow-xl
              overflow-hidden
            "
          >
            {/* Faint quote icon in background */}
            <svg
              className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 text-blue-100 dark:text-slate-700 opacity-30 z-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M9 17h-2a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h2M15 17h2a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4h-2" />
            </svg>
            {/* Avatar on top */}
            <Avatar className="w-16 h-16 border-2 border-blue-200 shadow z-10 mb-4">
              <AvatarImage src={t.avatar} alt={t.name} />
              <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {/* Quote */}
            <p className="italic text-base text-slate-700 dark:text-slate-200 text-center z-10 mb-6">
              "{t.quote}"
            </p>
            {/* Name and role */}
            <div className="flex flex-col items-center z-10 mt-auto">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {t.name}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {t.role}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const Home = () => {
  const navigate = useRouter()
  const features = [
    {
      icon: <Mic className="w-8 h-8 text-blue-600" />,
      title: "AI Based Medical Diagnose",
      description:
        "Describe your symptoms using voice commands for instant AI analysis",
      path: "/speech-analysis",
      buttonLabel: "Get Started",
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Medical Report Analysis",
      description:
        "Get intelligent health insights and preliminary assessments",
      path: "/ai-analysis",
      buttonLabel: "Start",
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Find Nearby Care",
      description:
        "Locate hospitals and doctors in your area with ratings and reviews",
      path: "/find-care",
      buttonLabel: "Find Now",
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      title: "Medical Records",
      description:
        "Securely store and manage your medical history and documents",
      path: "/medical-records",
      buttonLabel: "Check",
    },
    {
      icon: <Users className="w-8 h-8 text-red-600" />,
      title: "Doctor Directory",
      description: "Browse qualified healthcare professionals by specialty",
      path: "/doctor-directory",
      buttonLabel: "Check",
    },
    {
      icon: <Activity className="w-8 h-8 text-teal-600" />,
      title: "Health Monitoring",
      description:
        "Track your health metrics and receive personalized insights",
      path: "/health-monitoring",
      buttonLabel: "Start",
    },
  ]

  return (
    <div>
      <Header />
      <Hero />

      {/* feature section  */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of healthcare with our AI-powered platform
            designed to make medical care more accessible and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={() => navigate.push(feature.path)}
              buttonLabel={feature.buttonLabel}
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <GridBackground />
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Trusted by Patients Nationwide
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            See what our users are saying about their experience.
          </p>
        </div>
        <div className="relative flex justify-center gap-8 h-[500px]">
          <TestimonialScroller testimonials={testimonials1} duration="30s" />
          <TestimonialScroller testimonials={testimonials2} duration="40s" />
          <TestimonialScroller testimonials={testimonials3} duration="35s" />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
