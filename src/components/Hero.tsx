"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Brain, FileText, Activity, Mic, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Typewriter from "./Typewriter"
import AuthModal from "./AuthModal"
import { motion, useScroll, useTransform, Variants } from "framer-motion"

// Animated floating stat badges using Framer Motion
const StatBadge = ({
  icon,
  label,
  value,
  color,
  className = "",
  delay = 0,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  className?: string
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, type: "spring" }}
    className={`absolute flex items-center gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] ${className}`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${color} shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-foreground leading-none">{value}</p>
    </div>
  </motion.div>
)

const Hero = () => {
  const navigate = useRouter()
  const { status } = useSession()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { scrollY } = useScroll()
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const handleStartDiagnosis = () => {
    if (status === "authenticated") {
      navigate.push("/speech-analysis")
    } else {
      setIsAuthOpen(true)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    },
  }

  return (
    <>
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 px-4 overflow-hidden bg-background">
      {/* Dynamic Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
        
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-30 dark:opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(147,51,234,0.4) 50%, rgba(255,255,255,0) 80%)" }}
        />
        
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-30 dark:opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(59,130,246,0.5) 50%, rgba(255,255,255,0) 80%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left — Copy */}
          <motion.div 
            className="lg:col-span-6 flex flex-col items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: y1, opacity }}
          >
            {/* Trust pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-sm text-sm font-medium mb-8 overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400">
                DISHA Compliant &bull; Trusted by 10,000+ patients
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight">
              AI-Powered <br className="hidden sm:block" />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  Medical Care
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-blue-200/50 dark:bg-blue-900/50 -rotate-1 rounded-full blur-[2px]"></span>
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-xl font-medium">
              Get instant AI medical insights, track your vitals securely, 
              and carry your comprehensive health history in your pocket.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="h-14 px-8 text-base bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 group"
                onClick={handleStartDiagnosis}
              >
                <Mic className="mr-2 w-5 h-5 group-hover:text-blue-400 transition-colors" />
                Start AI Diagnosis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-2 border-transparent bg-clip-padding hover:border-blue-500/30 transition-all duration-300"
                onClick={() => navigate.push("/find-care")}
              >
                Find Care Nearby
              </Button>
            </motion.div>

            {/* Quick stats strip */}
            <motion.div variants={itemVariants} className="flex gap-8 mt-16 pt-8 border-t border-border/50">
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">500+</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">Verified Doctors</span>
              </div>
              <div className="w-px h-12 bg-border/50"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">99%</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">AI Accuracy Score</span>
              </div>
              <div className="w-px h-12 bg-border/50 hidden sm:block"></div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">24/7</span>
                <span className="text-sm font-medium text-muted-foreground mt-1">Instant Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Interactive 3D Mockup */}
          <motion.div 
            className="lg:col-span-6 relative flex items-center justify-center min-h-[500px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ y: y2 }}
          >
            {/* The main Glassmorphic App Window */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full max-w-md"
            >
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
                
                {/* MacOS style window header */}
                <div className="h-12 border-b border-border/40 flex items-center px-6 gap-2 bg-white/20 dark:bg-slate-800/20">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Good Morning</p>
                      <p className="text-xl font-bold text-foreground font-poppins">Health Dashboard</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* AI insight row */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/60 rounded-xl">
                      <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-0.5">AI Analysis Complete</p>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Blood report shows normal WBC levels. Keep hydrating!</p>
                    </div>
                  </div>

                  {/* Glassy Bento Style Vitals */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Heart Rate", value: "72 bpm", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
                      { label: "Blood Pressure", value: "120/80", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
                      { label: "Hemoglobin", value: "14 g/dL", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                      { label: "Blood Sugar", value: "98 mg/dL", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
                    ].map((v) => (
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -2 }}
                        key={v.label} 
                        className={`p-4 rounded-2xl ${v.bg} border border-white/40 dark:border-white/5 backdrop-blur-md shadow-sm`}
                      >
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{v.label}</p>
                        <p className={`text-xl font-bold ${v.color}`}>{v.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Typewriter line */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-white/40 dark:border-slate-700 shadow-inner">
                    <div className="relative flex h-3 w-3 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <Typewriter
                      words={[
                        "Scanning recent documents...",
                        "Syncing with wearable devices...",
                        "Analyzing symptom history...",
                        "System secure and ready.",
                      ]}
                      typingSpeed={40}
                      deletingSpeed={20}
                      pause={2000}
                      className="text-sm font-medium text-slate-600 dark:text-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating stat badges - positioned around the glass card */}
            <StatBadge
              icon={<FileText className="w-5 h-5 text-white" />}
              label="New Report Uploaded"
              value="Analysis ready"
              color="from-emerald-400 to-emerald-600"
              className="-top-8 -right-4 lg:-right-12"
              delay={0.8}
            />
            <StatBadge
              icon={<Users className="w-5 h-5 text-white" />}
              label="Nearest Doctor"
              value="Dr. Sharma (2km)"
              color="from-violet-400 to-violet-600"
              className="-bottom-8 -left-4 lg:-left-12"
              delay={1.1}
            />
          </motion.div>
        </div>
      </div>
    </section>
      <AuthModal isOpen={isAuthOpen} setIsOpen={setIsAuthOpen} defaultTab="signin" />
    </>
  )
}

export default Hero
