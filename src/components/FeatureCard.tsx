"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  buttonLabel?: string
  colorHint?: string
}

const FeatureCard = ({ icon, title, description, onClick, buttonLabel, colorHint = "blue" }: FeatureCardProps) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 dark:bg-blue-400/10 group-hover:bg-blue-500/20",
    purple: "bg-purple-500/10 dark:bg-purple-400/10 group-hover:bg-purple-500/20",
    orange: "bg-orange-500/10 dark:bg-orange-400/10 group-hover:bg-orange-500/20",
    teal: "bg-teal-500/10 dark:bg-teal-400/10 group-hover:bg-teal-500/20",
    green: "bg-green-500/10 dark:bg-green-400/10 group-hover:bg-green-500/20",
    red: "bg-red-500/10 dark:bg-red-400/10 group-hover:bg-red-500/20",
  }

  const glowClass = colorMap[colorHint] || colorMap.blue

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card
        className="group relative h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-lg text-card-foreground outline-none overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick() }}
      >
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/40 group-hover:to-transparent dark:group-hover:from-white/5 dark:group-hover:to-transparent transition-all duration-700 pointer-events-none" />
        
        {/* Glow effect positioned behind icon */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 ${glowClass} rounded-full blur-3xl group-hover:scale-150 transition-all duration-700 pointer-events-none`} />

        <CardHeader className="pb-4 relative z-10 p-8">
          {/* Icon container */}
          <div className="mb-6 inline-flex">
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-md border border-white/50 dark:border-slate-700 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-all duration-500 z-10">
              {icon}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-poppins text-slate-800 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-inter">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 relative z-10 px-8 pb-8 mt-auto">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-6"></div>
          <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-wider">
            {buttonLabel || "Learn More"}
            <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default FeatureCard