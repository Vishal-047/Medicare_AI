import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import DoctorApplication from "@/models/DoctorApplication"
import User from "@/models/User"
import { sendApplicationStatusEmail } from "@/lib/mail"
import bcrypt from "bcrypt"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()
  const { id } = await params
  const { status } = await req.json()

  if (!id || !status || !["approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { message: "Invalid application ID or status provided." },
      { status: 400 }
    )
  }

  try {
    const application = await DoctorApplication.findById(id)

    if (!application) {
      return NextResponse.json(
        { message: "Application not found." },
        { status: 404 }
      )
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        { message: `Application has already been ${application.status}.` },
        { status: 409 }
      )
    }

    application.status = status
    await application.save()

    let doctorId: string | undefined = undefined
    // If approved, create a corresponding user entry for the doctor
    if (status === "approved") {
      let user = await User.findOne({
        email: application.professionalEmail,
      })
      if (!user) {
        // This is a simplified password generation.
        // In a real-world scenario, you'd send an invitation link
        // for the doctor to set their own password.
        const tempPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        user = await User.create({
          name: application.fullName,
          email: application.professionalEmail,
          password: hashedPassword,
          phoneNumber: application.privateContactNumber,
          role: "doctor",
          isVerified: true, // Assuming verification upon admin approval
        })
      }
      doctorId = user && user._id ? user._id.toString() : undefined
    }

    // Send notification email
    await sendApplicationStatusEmail(
      application.professionalEmail,
      application.fullName,
      status,
      doctorId
    )

    return NextResponse.json(
      { message: `Application ${status} successfully.`, data: application },
      { status: 200 }
    )
  } catch (error) {
    // @ts-expect-error
    return NextResponse.json(
      // @ts-expect-error
      { message: "Internal Server Error", error: error?.message },
      { status: 500 }
    )
  }
}
