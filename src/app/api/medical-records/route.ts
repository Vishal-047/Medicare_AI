import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || !token.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  
  try {
    await connectDB()
    const user = await User.findById(token.id).select("medicalHistory documents")
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const sortedHistory = (user.medicalHistory || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const sortedDocuments = (user.documents || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ medicalHistory: sortedHistory, documents: sortedDocuments })
  } catch (error) {
    console.error("Failed to read medical records:", error)
    return NextResponse.json(
      { error: "Failed to retrieve records" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || !token.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    await connectDB()

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const recordDataString = formData.get("recordData") as string | null

    // Case 1: It's a medical record with analysis
    if (recordDataString) {
      const recordData = JSON.parse(recordDataString)
      let originalReportUrl: string | undefined = undefined

      if (file) {
        const reportsDir = path.join(process.cwd(), "private_uploads", "reports")
        await fs.mkdir(reportsDir, { recursive: true })

        const fileBuffer = Buffer.from(await file.arrayBuffer())
        const fileExtension = path.extname(file.name)
        const fileName = `${token.id}-${Date.now()}${fileExtension}`
        const filePath = path.join(reportsDir, fileName)

        await fs.writeFile(filePath, fileBuffer)
        originalReportUrl = fileName
      }
      
      const newRecord = {
        ...recordData,
        originalReportUrl,
        date: new Date(),
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        token.id,
        { $push: { medicalHistory: newRecord } },
        { new: true, runValidators: true }
      )
      
      const savedRecord = updatedUser.medicalHistory[updatedUser.medicalHistory.length - 1];

      return NextResponse.json(savedRecord)
    } 
    // Case 2: It's a document-only upload
    else if (file) {
      const documentsDir = path.join(process.cwd(), "private_uploads", "documents");
      await fs.mkdir(documentsDir, { recursive: true });

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${token.id}-${Date.now()}-${file.name}`;
      const filePath = path.join(documentsDir, fileName);
      await fs.writeFile(filePath, fileBuffer);
      
      const newDocument = {
        name: file.name,
        type: file.type,
        size: file.size,
        category: "Uploaded",
        url: fileName,
        date: new Date(),
      };
      
      await User.findByIdAndUpdate(
        token.id,
        { $push: { documents: newDocument } },
        { new: true, runValidators: true }
      );

      return NextResponse.json(newDocument);
    }
    // Case 3: Invalid request
    else {
      return NextResponse.json({ error: "No file or record data provided" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error saving medical record:", error)
    return NextResponse.json(
      { error: error.message || "Failed to save medical record." },
      { status: 500 }
    )
  }
}


