import { connectDB } from "@/lib/db"
import User from "@/models/User"
import NextAuth, { AuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { generateOtp, sendOtp } from "@/lib/otp"
import bcrypt from "bcrypt"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Please provide your credentials.")
        }
        await connectDB()

        const user = await User.findOne({
          $or: [
            { email: credentials.emailOrPhone },
            { phoneNumber: credentials.emailOrPhone },
          ],
          isVerified: true,
        })

        if (!user) {
          // Generic error to avoid leaking user existence
          throw new Error("Invalid credentials.")
        }

        // Use bcrypt for password check
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials.")
        }

        // Send OTP
        const otp = generateOtp()
        user.otp = otp
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        await user.save()
        await sendOtp(user.phoneNumber, otp)

        // Signal to client to prompt for OTP
        throw new Error(`OTP_REQUIRED:${user.email}`)
      },
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Please provide your credentials.")
        }
        await connectDB()

        const user = await User.findOne({
          email: credentials.email,
          isVerified: true,
        })

        if (!user || !user.otp || !user.otpExpires) {
          throw new Error("OTP not requested or user not found.")
        }

        if (new Date() > user.otpExpires) {
          throw new Error("OTP has expired.")
        }

        // Plain text OTP check
        const isOtpCorrect = credentials.otp === user.otp

        if (!isOtpCorrect) {
          throw new Error("Invalid OTP.")
        }

        // Clear OTP fields after successful verification
        user.otp = null
        user.otpExpires = null
        await user.save()

        // Return the full user object to complete the sign-in
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // Or "/login" if you want a dedicated login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
