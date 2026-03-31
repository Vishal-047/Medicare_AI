"use client"
import { Mic, Brain, MapPin, FileText, Users, Activity } from "lucide-react"
import FeatureCard from "@/components/FeatureCard"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"

// Enhanced Grid Background
const GridBackground = () => (
  <div
    className="absolute inset-0 bg-transparent opacity-40 pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
    }}
    aria-hidden
  />
)

// New, diverse testimonials with random Unsplash avatars
const allTestimonials = [
  { quote: "Managing my parents' medical records used to be a nightmare. This platform has made it incredibly simple.", name: "Priya S.", role: "Software Engineer", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { quote: "The health monitoring feature is fantastic. It helps me keep track of my vitals and stay proactive about my health.", name: "Rajesh V.", role: "Accountant", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { quote: "A beautifully designed and incredibly useful tool. It feels like the future of personal health management.", name: "Ananya G.", role: "Student", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { quote: "Uploading my lab reports and getting an easy-to-read summary saved me so much confusion. Highly recommend!", name: "Vikram M.", role: "Architect", avatar: "https://randomuser.me/api/portraits/men/65.jpg" },
  { quote: "The AI symptom analysis gave me peace of mind and pointed me to the right specialist. A game-changer!", name: "Sunita R.", role: "Teacher", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
  { quote: "I found a great doctor nearby in minutes. The detailed information helped me make a confident choice.", name: "Amit K.", role: "Marketing Manager", avatar: "https://randomuser.me/api/portraits/men/23.jpg" },
  { quote: "The reminders for medication and appointments are so helpful for my elderly parents.", name: "Fatima Z.", role: "Homemaker", avatar: "https://randomuser.me/api/portraits/women/50.jpg" },
  { quote: "I love how secure and private my data feels. The platform is easy to use and trustworthy.", name: "John D.", role: "Lawyer", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
  { quote: "The support team is responsive and caring. I feel truly looked after as a user.", name: "Meera P.", role: "Nurse", avatar: "https://randomuser.me/api/portraits/women/36.jpg" },
]

// Split testimonials into 3 columns
const testimonials1 = allTestimonials.filter((_, i) => i % 3 === 0)
const testimonials2 = allTestimonials.filter((_, i) => i % 3 === 1)
const testimonials3 = allTestimonials.filter((_, i) => i % 3 === 2)

// Premium Testimonial Scroller design
const TestimonialScroller = ({
  testimonials,
  duration = "30s",
}: {
  testimonials: any[]
  duration?: string
}) => {
  const items = [...testimonials, ...testimonials]
  return (
    <div className="testimonial-scroll-outer relative">
      <div
        className="testimonial-scroll-inner hover:[animation-play-state:paused]"
        style={{ animationDuration: duration }}
      >
        {items.map((t, i) => (
          <Card
            key={i}
            className="flex-shrink-0 w-80 mx-auto mb-8 px-8 pt-10 pb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-[2rem] shadow-lg relative flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden group"
          >
            {/* Faint shiny overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Faint quote icon in background */}
            <svg
              className="absolute top-6 left-6 w-12 h-12 text-blue-500/10 dark:text-blue-400/10 z-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            
            <Avatar className="w-20 h-20 border-4 border-white dark:border-slate-800 shadow-xl z-10 mb-6">
              <AvatarImage src={t.avatar} alt={t.name} />
              <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-medium text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 text-center z-10 mb-8 font-inter">
              "{t.quote}"
            </p>
            <div className="flex flex-col items-center z-10 mt-auto">
              <p className="font-bold text-slate-900 dark:text-slate-100 font-poppins">
                {t.name}
              </p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">
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
      icon: <Mic className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "AI Voice Diagnosis",
      description: "Describe symptoms via voice or text and get instant AI-powered medical insights.",
      path: "/speech-analysis",
      buttonLabel: "Start Diagnosis",
      colorHint: "blue",
      span: "md:col-span-2 lg:col-span-2"
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      title: "AI Report Analysis",
      description: "Upload your lab reports and get an easy-to-understand summary of findings.",
      path: "/ai-analysis",
      buttonLabel: "Analyze Report",
      colorHint: "purple",
      span: "md:col-span-1 lg:col-span-1"
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
      title: "Medical Records",
      description: "Securely store, organize, and access all your health data from anywhere securely.",
      path: "/medical-records",
      buttonLabel: "View Records",
      colorHint: "orange",
      span: "md:col-span-1 lg:col-span-1"
    },
    {
      icon: <Activity className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: "Health Monitoring",
      description: "Track your vitals over time and receive personalized insights to stay ahead.",
      path: "/health-monitoring",
      buttonLabel: "Track Vitals",
      colorHint: "teal",
      span: "md:col-span-2 lg:col-span-2"
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />,
      title: "Find Nearby Care",
      description: "Locate hospitals and doctors in your area with real-time distance.",
      path: "/find-care",
      buttonLabel: "Find Hospitals",
      colorHint: "green",
      span: "md:col-span-1 lg:col-span-1"
    },
    {
      icon: <Users className="w-8 h-8 text-red-600 dark:text-red-400" />,
      title: "Doctor Directory",
      description: "Browse verified healthcare professionals by specialty and language.",
      path: "/doctor-directory",
      buttonLabel: "Browse Doctors",
      colorHint: "red",
      span: "md:col-span-2 lg:col-span-2"
    },
  ]

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-inter text-foreground overflow-hidden">
      <Header />
      <Hero />

      {/* Bento Grid Feature Section */}
      <section className="relative py-32 px-4">
        {/* Subtle decorative background for features */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-4">Powerful Features</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 font-poppins">
              A Complete Healthcare Ecosystem
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Experience the future of personal healthcare with our state-of-the-art AI, 
              designed to be your secure, all-in-one medical assistant.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="w-full flex"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-full min-h-full">
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    onClick={() => navigate.push(feature.path)}
                    buttonLabel={feature.buttonLabel}
                    colorHint={feature.colorHint}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-32 relative">
        <GridBackground />
        
        <div className="container mx-auto px-4 text-center mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase mb-4">Success Stories</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-poppins">
              Trusted by Patients Nationwide
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-6 max-w-2xl mx-auto text-xl leading-relaxed">
              Loved by thousands for its privacy, speed, and accuracy. Discover how we're changing lives every day.
            </p>
          </motion.div>
        </div>

        {/* The scrollers with Edge Fading to disappear beautifully into the background */}
        <div 
          className="relative flex justify-center gap-8 h-[550px]"
          style={{ 
            maskImage: 'linear-gradient(to top, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to top, transparent, black 15%, black 85%, transparent)' 
          }}
        >
          <TestimonialScroller testimonials={testimonials1} duration="40s" />
          <TestimonialScroller testimonials={testimonials2} duration="55s" />
          <TestimonialScroller testimonials={testimonials3} duration="45s" />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
