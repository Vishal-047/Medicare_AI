"use client"
import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Check } from "lucide-react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const checks = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "At least one uppercase letter", regex: /[A-Z]/ },
    { label: "At least one lowercase letter", regex: /[a-z]/ },
    { label: "At least one number", regex: /[0-9]/ },
    { label: "At least one special character", regex: /[@$!%*?&]/ },
  ]

  return (
    <div className="space-y-1 text-sm">
      {checks.map((check, index) => (
        <div key={index} className="flex items-center">
          {check.regex.test(password) ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <div className="w-4 h-4 mr-2" /> // Placeholder for alignment
          )}
          <span
            className={
              check.regex.test(password)
                ? "text-muted-foreground"
                : "text-foreground"
            }
          >
            {check.label}
          </span>
        </div>
      ))}
    </div>
  )
}

interface AuthModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  message?: string
  children?: React.ReactNode
  defaultTab?: "signin" | "signup"
}

type AuthStep = "details" | "otp"
type LoginMethod = "email" | "phone"

const AuthModal = ({ isOpen, setIsOpen, message, defaultTab = "signin" }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
    }
  }, [isOpen, defaultTab])

  // Common state
  const [email, setEmail] = useState("")
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Login state
  const [loginStep, setLoginStep] = useState<AuthStep>("details")
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email")

  // Sign up state
  const [signupStep, setSignupStep] = useState<AuthStep>("details")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const router = useRouter()

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.")
      return
    }
    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        toast.success("Location captured!")
        setIsGettingLocation(false)
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("You denied the request for Geolocation.")
            break
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.")
            break
          case error.TIMEOUT:
            toast.error("The request to get user location timed out.")
            break
          default:
            toast.error("An unknown error occurred while getting location.")
            break
        }
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    )
  }

  // Use variables to avoid unused warning
  useEffect(() => {
    if (false) {
      console.log(location, isGettingLocation, handleGetLocation);
    }
  }, [location, isGettingLocation])

  // New handler to request OTP for signup
  const handleRequestSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!")
      return
    }
    setIsLoading(true)
    try {
      const userData = { name, email, password, phoneNumber }
      await axios.post("/api/auth/send-otp", userData)
      toast.success("OTP has been sent to your phone.")
      setSignupStep("otp")
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast.error(axiosError.response?.data?.message || "Failed to send OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  // Renamed from handleSignUp to reflect its new purpose
  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.post("/api/signup", { email, otp })
      toast.success("Account created successfully! Please sign in.")
      // Reset form and switch to signin
      setPassword("")
      setConfirmPassword("")
      setName("")
      setPhoneNumber("")
      setOtp("")
      setSignupStep("details")
      setActiveTab("signin")
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast.error(axiosError.response?.data?.message || "Failed to verify OTP.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const identifier = loginMethod === "email" ? emailOrPhone : phoneNumber

      // Step 1: Send credentials. Expect an error that indicates OTP is required.
      const res = await signIn("credentials", {
        emailOrPhone: identifier,
        password,
        redirect: false,
      })

      if (res?.error) {
        if (res.error.startsWith("OTP_REQUIRED")) {
          // This is the expected "error" for the first step.
          const emailFromServer = res.error.split(":")[1]
          setEmail(emailFromServer) // Store email for the OTP verification step
          toast.success("OTP sent to your registered phone number.")
          setLoginStep("otp")
          setLoginMethod("phone")
          setSignupStep("details")
        } else {
          // This is a real error like "Incorrect password."
          toast.error(res.error)
        }
      }
      // On a successful password check, we no longer fall through to here.
      // The session is not created yet.
    } catch {
      toast.error("An unknown error occurred during login.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await signIn("otp", {
        email: email, // We use the email we stored from the first step
        otp,
        redirect: false,
      })

      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Login successful")
        setIsOpen(false)
        router.refresh()
      }
    } catch {
      toast.error("An error occurred during OTP verification.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetAuthState = () => {
    setEmail("")
    setEmailOrPhone("")
    setPassword("")
    setOtp("")
    setLoginStep("details")
    setLoginMethod("email")
    setSignupStep("details")
    // also reset signup fields
    setConfirmPassword("")
    setName("")
    setPhoneNumber("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md w-full">
        {message && (
          <div className="mb-4 text-center text-blue-600 font-medium">
            {message}
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Welcome to MediCare AI</DialogTitle>
          <DialogDescription>
            {activeTab === "signin"
              ? "Sign in to your account to continue."
              : "Create an account to get started."}
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "signin" | "signup")
            resetAuthState()
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Get Started</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            {loginStep === "details" && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <RadioGroup
                  value={loginMethod}
                  onValueChange={(value) =>
                    setLoginMethod(value as LoginMethod)
                  }
                  className="flex items-center space-x-4 py-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="login-email" />
                    <Label htmlFor="login-email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="login-phone" />
                    <Label htmlFor="login-phone">Phone</Label>
                  </div>
                </RadioGroup>

                {loginMethod === "email" ? (
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      placeholder="Enter your email"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="signin-phone">Phone Number</Label>
                    <PhoneInput
                      id="signin-phone"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(value) => setPhoneNumber(value || "")}
                      defaultCountry="IN"
                      className="input"
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Sign In"}
                </Button>
              </form>
            )}
            {loginStep === "otp" && (
              <form
                onSubmit={handleVerifyLoginOtp}
                className="space-y-6 flex flex-col items-center"
              >
                <Label htmlFor="otp-input">Enter OTP</Label>
                <p className="text-sm text-muted-foreground">
                  An OTP has been sent to your registered phone.
                </p>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setLoginStep("details")}
                >
                  Back to login
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="signup">
            {signupStep === "details" && (
              <form onSubmit={handleRequestSignupOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <PhoneInput
                    id="signup-phone"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || "")}
                    defaultCountry="IN"
                    className="input" // Basic styling, can be improved
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">
                    Confirm Password
                  </Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {/* Password strength indicator */}
                {password && <PasswordStrengthIndicator password={password} />}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Get OTP"}
                </Button>
              </form>
            )}

            {signupStep === "otp" && (
              <form
                onSubmit={handleVerifySignup}
                className="space-y-6 flex flex-col items-center"
              >
                <Label htmlFor="otp-input">Enter OTP</Label>
                <p className="text-sm text-muted-foreground">
                  An OTP has been sent to {phoneNumber}.
                </p>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Sign Up"}
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setSignupStep("details")}
                >
                  Back to details
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
