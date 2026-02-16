import { signIn } from "next-auth/react"

export async function adminSignIn(
  provider: "admin-credentials" | "admin-otp",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) {
  // Use the admin NextAuth endpoint
  return await signIn(
    provider,
    {
      ...data,
      redirect: false,
      callbackUrl: "/admin",
    },
    { basePath: "/api/auth/admin" }
  )
}
