"use client"

import React, { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileText, Activity, LogOut, Loader2, User } from "lucide-react"
import { Poppins, Inter } from "next/font/google"
import AuthModal from "@/components/AuthModal"

const poppins = Poppins({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-inter",
})

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  // Ensure unauthenticated users are prompted to login or routed correctly
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div
      className={`min-h-screen relative ${inter.variable} ${poppins.variable} bg-background dark:bg-[#181A1B]`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, var(--grid-color, #E9ECEF) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color, #E9ECEF) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.5,
        }}
      />
      
      {/* Watermark symbol */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 flex items-center justify-center z-0"
        style={{
          fontSize: "18vw",
          color: "var(--watermark-color, #A0AEC0)",
          opacity: 0.04,
          fontWeight: 700,
          userSelect: "none",
        }}
      >
        &#9877;
      </div>
      
      <style jsx global>{`
        html.light {
          --grid-color: #e9ecef;
          --watermark-color: #a0aec0;
        }
        html.dark {
          --grid-color: #23272b;
          --watermark-color: #4a5568;
        }
      `}</style>

      <div className="relative z-10">
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-semibold text-foreground mb-2 font-poppins">
              My Profile
            </h1>
            <p className="text-lg text-foreground font-inter font-normal">
              Manage your personal information and health preferences.
            </p>
          </div>

          {status === "loading" ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : status === "unauthenticated" ? (
            <div className="text-center py-16 bg-card rounded-xl shadow-sm border border-border">
              <h3 className="text-2xl font-semibold mb-3 font-poppins text-foreground">
                Sign In Required
              </h3>
              <p className="text-muted-foreground mb-6 font-inter">
                Please sign in to view and manage your profile.
              </p>
              <Button onClick={() => setIsAuthModalOpen(true)} className="px-8">
                Sign In
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Sidebar */}
              <div className="md:col-span-1">
                <Card className="bg-card shadow-sm border-border text-center overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
                  <CardContent className="pt-0 relative px-6 pb-6">
                    <Avatar className="w-24 h-24 border-4 border-card mx-auto -mt-12 rounded-full mb-4 shadow-sm bg-white dark:bg-slate-800">
                      <AvatarImage
                        src={session?.user?.image ?? undefined}
                        alt={session?.user?.name ?? "User Avatar"}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {session?.user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || <User className="w-10 h-10" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h2 className="text-xl font-bold text-foreground font-poppins mb-1">
                      {session?.user?.name || "Patient"}
                    </h2>
                    <p className="text-sm text-muted-foreground font-inter mb-6 truncate">
                      {session?.user?.email}
                    </p>

                    <Button 
                      variant="destructive" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-card shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="font-poppins text-foreground">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="font-inter">
                      Review your personal data associated with your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 font-inter text-foreground">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Full Name</p>
                        <p className="font-medium">{session?.user?.name || "Not provided"}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Email Address</p>
                        <p className="font-medium truncate">{session?.user?.email || "Not provided"}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Role</p>
                        <p className="font-medium capitalize">User / Patient</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Account Status</p>
                        <p className="font-medium text-green-600 dark:text-green-400">Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <h3 className="text-xl font-semibold text-foreground mt-8 mb-4 font-poppins">
                  Quick Access
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card 
                    className="bg-card shadow-sm border-border cursor-pointer hover:border-blue-500 transition-colors group"
                    onClick={() => router.push("/medical-records")}
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground font-poppins">Medical Records</h4>
                        <p className="text-sm text-muted-foreground font-inter mt-1">View your history, documents, and bills.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-card shadow-sm border-border cursor-pointer hover:border-green-500 transition-colors group"
                    onClick={() => router.push("/health-monitoring")}
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
                        <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground font-poppins">Health Monitoring</h4>
                        <p className="text-sm text-muted-foreground font-inter mt-1">Track vitals, steps, and daily progress.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} />
    </div>
  )
}
