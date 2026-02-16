import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export async function GET(
  req: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const [filename] = params.params
  if (!filename) {
    return NextResponse.json({ error: "No file specified" }, { status: 400 })
  }

  const filePath = path.join(
    process.cwd(),
    "private_uploads",
    "documents",
    filename
  )

  try {
    const file = await fs.readFile(filePath)
    // Set appropriate content-type based on file extension
    const ext = path.extname(filename).toLowerCase()
    let contentType = "application/octet-stream"
    if (ext === ".pdf") contentType = "application/pdf"
    if (ext === ".png") contentType = "image/png"
    // Add more types as needed

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename=\"${filename}\"`,
      },
    })
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
