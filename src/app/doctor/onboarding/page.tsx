"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DoctorOnboarding() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get("email")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function onboard() {
      const res = await fetch(
        `/api/doctor-onboarding?email=${encodeURIComponent(email || "")}`
      )
      if (res.ok) {
        router.replace("/doctor/dashboard")
      } else {
        const data = await res.json()
        setError(data.error || "Onboarding failed.")
      }
    }
    if (email) onboard()
  }, [email, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <h2 className="text-xl font-semibold">Fetching your details...</h2>
      <p className="text-muted-foreground mt-2">
        Building your profile. Please wait.
      </p>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
