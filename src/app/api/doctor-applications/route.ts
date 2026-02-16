import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import DoctorApplication from "@/models/DoctorApplication"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

async function uploadFile(file: File): Promise<string | null> {
  try {
    console.log(
      "[API] Calling utapi.uploadFiles for",
      file.name,
      file.size,
      file.type
    )
    const response = await utapi.uploadFiles(file)
    console.log("[API] UploadThing response:", response)
    if (response.data) {
      return response.data.url
    }
    if (response.error) {
      console.error("[API] UploadThing error:", response.error)
    }
    return null
  } catch (error) {
    console.error("[API] UploadThing file upload error:", error)
    return null
  }
}

export async function POST(req: NextRequest) {
  console.log("[API] Received POST /api/doctor-applications")
  await connectDB()

  try {
    const formData = await req.formData()
    console.log("[API] Parsed form data")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applicationData: { [key: string]: any } = {}
    const fileFields = [
      "mbbsCertificate",
      "pgDegree",
      "superSpecialtyDegree",
      "governmentId",
      "professionalHeadshot",
    ]

    for (const [key, value] of formData.entries()) {
      if (fileFields.includes(key) && value instanceof File) {
        console.log(`[API] Uploading file for field: ${key}`)
        const url = await uploadFile(value)
        if (!url) {
          console.error(`[API] Failed to upload file for field: ${key}`)
          if (key !== "superSpecialtyDegree") {
            return NextResponse.json(
              { message: `Failed to upload ${key}` },
              { status: 500 }
            )
          }
        }
        applicationData[key] = url
      } else if (key === "servicesOffered" || key === "languagesSpoken") {
        applicationData[key] = JSON.parse(value as string)
      } else {
        applicationData[key] = value
      }
    }
    console.log("[API] All files processed and form data assembled")
    // Ensure required files were uploaded
    if (
      !applicationData.mbbsCertificate ||
      !applicationData.pgDegree ||
      !applicationData.governmentId ||
      !applicationData.professionalHeadshot
    ) {
      console.error("[API] Missing required document uploads.")
      return NextResponse.json(
        { message: "Missing required document uploads." },
        { status: 400 }
      )
    }

    const newApplication = new DoctorApplication(applicationData)
    console.log("[API] Saving new application to DB")
    await newApplication.save()
    console.log("[API] Application saved successfully")

    return NextResponse.json(
      { message: "Application submitted successfully", data: newApplication },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] Doctor application error:", error)
    // @ts-expect-error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message:
            "An application with this registration number already exists.",
        },
        { status: 409 }
      )
    }
    return NextResponse.json(
      // @ts-expect-error
      { message: "Internal Server Error", error: error?.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  await connectDB()
  try {
    const applications = await DoctorApplication.find({}).sort({
      createdAt: -1,
    })
    return NextResponse.json({ data: applications }, { status: 200 })
  } catch (error) {
    console.error("[API] Doctor application GET error:", error)
    return NextResponse.json(
      // @ts-expect-error
      { message: "Internal Server Error", error: error?.message },
      { status: 500 }
    )
  }
}
