import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import DoctorApplication from "@/models/DoctorApplication"

export async function GET() {
  await connectDB()
  try {
    // Fetch all approved applications and select only the fields needed for the directory
    const doctors = await DoctorApplication.find(
      { status: "approved" },
      // Projection: select the fields to return
      {
        fullName: 1,
        primarySpecialty: 1,
        professionalHeadshot: 1,
        clinicAddress: 1,
        consultationFees: 1,
        professionalBio: 1,
        privateContactNumber: 1,
        _id: 1,
      }
    ).lean() // .lean() returns plain JS objects instead of Mongoose documents for performance

    const formattedDoctors = doctors.map((doc) => ({
      id: doc._id,
      name: doc.fullName,
      speciality: doc.primarySpecialty,
      phone: doc.privateContactNumber,
      location: {
        city: doc.clinicAddress.split(",").pop()?.trim() || "India",
        lat: 0,
        lng: 0,
      }, // Simplified location
      photo: doc.professionalHeadshot,
      bio: doc.professionalBio,
    }))

    return NextResponse.json({ data: formattedDoctors }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      // @ts-expect-error
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    )
  }
}
