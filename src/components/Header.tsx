"use client"
import { Activity, LogIn, UserPlus, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { HeaderClient } from "./HeaderClient"
import React, { useState } from "react"
import { useSession } from "next-auth/react"
import AuthModal from "./AuthModal"

const navItems = [
  { label: "Home", path: "/" },
  { label: "Find Care", path: "/find-care" },
  { label: "Doctors", path: "/doctor-directory" },
  { label: "Records", path: "/medical-records", requiresAuth: true },
  { label: "Schemes", path: "/medical-schemes" },
  { label: "Join Us", path: "/join-us" },
]

const Header = () => {
  const navigate = useRouter()
  const { status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin')
  const [showRecordsMessage, setShowRecordsMessage] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleRecordsClick = () => {
    if (status === "authenticated") {
      navigate.push("/medical-records")
    } else {
      setAuthModalTab('signin')
      setIsAuthModalOpen(true)
      setShowRecordsMessage(true)
    }
    setIsMobileMenuOpen(false)
  }

  const handleSignInClick = () => {
    setAuthModalTab('signin')
    setIsAuthModalOpen(true)
    setShowRecordsMessage(false)
    setIsMobileMenuOpen(false)
  }

  const handleSignUpClick = () => {
    setAuthModalTab('signup')
    setIsAuthModalOpen(true)
    setShowRecordsMessage(false)
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.requiresAuth) {
      handleRecordsClick()
    } else {
      navigate.push(item.path)
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header className="bg-background shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate.push("/")}
            >
              <Activity className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-foreground">
                MediCare AI
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item)}
                  className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer font-medium"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {status !== "authenticated" && (
                <>
                  <button
                    onClick={handleSignInClick}
                    className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-blue-600 text-blue-600 bg-white dark:bg-transparent shadow-sm hover:bg-blue-50 dark:hover:bg-blue-950 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
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

            {/* Mobile: theme toggle + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <HeaderClient />
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item)}
                  className="w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}

              {status !== "authenticated" && (
                <div className="pt-3 border-t flex flex-col gap-2">
                  <button
                    onClick={handleSignInClick}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUpClick}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-semibold"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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
