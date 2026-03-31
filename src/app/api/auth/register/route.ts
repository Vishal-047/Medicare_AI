import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

// ── [OTP DISABLED for development] ──────────────────────────────────────────
// This route bypasses OTP verification and creates the user as verified
// directly. Replace with the send-otp → verify-otp flow for production.
// ────────────────────────────────────────────────────────────────────────────

const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export async function POST(req: Request) {
  try {
    const { name, email, password, phoneNumber, latitude, longitude } =
      await req.json()

    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      )
    }

    if (!passwordStrengthRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
        { status: 400 }
      )
    }

    await connectDB()

    // Hash password once — used in both the update and create branches below
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check for ANY existing user with this email or phone (verified or not)
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    })


    if (existingUser) {
      if (existingUser.isVerified) {
        // Fully registered user — don't allow re-registration
        return NextResponse.json(
          { message: "User with this email or phone number already exists." },
          { status: 409 }
        )
      }
      // Unverified user left over from old OTP flow — update & verify in-place
      existingUser.name = name
      existingUser.password = hashedPassword
      existingUser.phoneNumber = phoneNumber
      existingUser.isVerified = true
      existingUser.otp = null
      existingUser.otpExpires = null
      if (latitude && longitude) {
        existingUser.location = {
          type: "Point",
          coordinates: [longitude, latitude],
        }
      }
      await existingUser.save()
      return NextResponse.json(
        { message: "Account created successfully.", userId: existingUser._id },
        { status: 201 }
      )
    }

    // Brand-new user — create fresh
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      isVerified: true,
      otp: null,
      otpExpires: null,
      ...(latitude && longitude
        ? { location: { type: "Point", coordinates: [longitude, latitude] } }
        : {}),
    })

    return NextResponse.json(
      { message: "Account created successfully.", userId: newUser._id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error during direct registration:", error)
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    )
  }
}
