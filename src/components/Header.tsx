"use client"
import { Activity, LogIn, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { HeaderClient } from "./HeaderClient"
import React, { useState } from "react"
import { useSession } from "next-auth/react"
import AuthModal from "./AuthModal"

const Header = () => {
  const navigate = useRouter()
  const { status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin')
  const [showRecordsMessage, setShowRecordsMessage] = useState(false)

  const handleRecordsClick = () => {
    if (status === "authenticated") {
      navigate.push("/medical-records")
    } else {
      setAuthModalTab('signin')
      setIsAuthModalOpen(true)
      setShowRecordsMessage(true)
    }
  }

  const handleSignInClick = () => {
    setAuthModalTab('signin')
    setIsAuthModalOpen(true)
    setShowRecordsMessage(false)
  }

  const handleSignUpClick = () => {
    setAuthModalTab('signup')
    setIsAuthModalOpen(true)
    setShowRecordsMessage(false)
  }

  return (
    <>
      <header className="bg-background shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate.push("/")}
            >
              <Activity className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-foreground">
                MediCare AI
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => navigate.push("/")}
                className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => navigate.push("/find-care")}
                className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
              >
                Find Care
              </button>
              <button
                onClick={() => navigate.push("/doctor-directory")}
                className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
              >
                Doctors
              </button>
              <button
                onClick={handleRecordsClick}
                className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
              >
                Records
              </button>
              <button
                onClick={() => navigate.push("/medical-schemes")}
                className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
              >
                Schemes
              </button>
              <button
                onClick={() => navigate.push("/join-us")}
                className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
              >
                Join Us
              </button>
            </nav>
            <div className="flex items-center space-x-2">
              {status !== "authenticated" && (
                <>
                  <button
                    onClick={handleSignInClick}
                    className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-blue-600 text-blue-600 bg-white shadow-sm hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUpClick}
                    className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-200 transition-all font-semibold"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </button>
                  <span className="mx-2 h-6 w-px bg-gray-200" />
                </>
              )}
              <HeaderClient />
            </div>
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        setIsOpen={setIsAuthModalOpen}
        defaultTab={authModalTab}
        {...(showRecordsMessage ? { message: "Please sign in or sign up to access your medical records." } : {})}
      />
    </>
  )
}
export default Header
