"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn, KeyRound } from "lucide-react"
import { adminSignIn } from "@/lib/adminSignIn"

export default function AdminLoginPage() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials")
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("") // for OTP step
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await adminSignIn("admin-credentials", {
        emailOrPhone,
        password,
      })
      if (res?.error) {
        if (res.error.startsWith("OTP_REQUIRED")) {
          setEmail(res.error.split(":")[1])
          setStep("otp")
        } else {
          setError(res.error)
        }
      }
    } catch {
      setError("Unknown error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await adminSignIn("admin-otp", {
        email,
        otp,
      })
      if (res?.error) {
        setError(res.error)
      } else {
        router.replace("/admin")
      }
    } catch {
      setError("Unknown error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-black">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <KeyRound className="h-6 w-6 text-primary" /> Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "credentials" && (
            <form onSubmit={handleCredentials} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email or Phone
                </label>
                <Input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Login
              </Button>
            </form>
          )}
          {step === "otp" && (
            <form onSubmit={handleOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">OTP</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  autoFocus
                  autoComplete="one-time-code"
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="mr-2 h-4 w-4" />
                )}
                Verify OTP
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
