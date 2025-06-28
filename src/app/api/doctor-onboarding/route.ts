import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import DoctorApplication from "@/models/DoctorApplication"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  await connectDB()
  const email = req.nextUrl.searchParams.get("email")
  if (!email)
    return NextResponse.json({ error: "Missing email" }, { status: 400 })

  const application = await DoctorApplication.findOne({
    professionalEmail: email,
  })
  if (!application || application.status !== "approved") {
    return NextResponse.json(
      { error: "Not found or not approved" },
      { status: 404 }
    )
  }

  let user = await User.findOne({ email: application.professionalEmail })
  if (!user) {
    user = await User.create({
      name: application.fullName,
      email: application.professionalEmail,
      phoneNumber: application.privateContactNumber,
      role: "doctor",
      isVerified: true,
      // Add more fields as needed
    })
  }

  return NextResponse.json({ success: true, user })
}
