import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Poppler } from "node-poppler"
import path from "path"
import fs from "fs/promises"
import { recognize } from "node-tesseract-ocr"
import os from "os"

// Cross-platform Poppler instance
let poppler: Poppler
if (os.platform() === "win32") {
  poppler = new Poppler(
    path.join(
      process.cwd(),
      "node_modules",
      "node-poppler",
      "src",
      "lib",
      "win32",
      "poppler-24.07.0",
      "Library",
      "bin"
    )
  )
} else {
  poppler = new Poppler()
}

// Do NOT import pdfjs statically. It will be imported dynamically inside the function.

async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    const tempDir = path.join(process.cwd(), "temp")
    await fs.mkdir(tempDir, { recursive: true })
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.pdf`)
    await fs.writeFile(tempFilePath, buffer)

    try {
      const text = await poppler.pdfToText(tempFilePath)
      return text
    } catch (error) {
      console.error("Error processing PDF with Poppler:", error)
      throw new Error("Failed to extract text from PDF.")
    } finally {
      // Clean up the temporary file
      await fs.unlink(tempFilePath)
    }
  } else if (mimeType.startsWith("image/")) {
    try {
      const text = await recognize(buffer, {
        lang: "eng",
        oem: 1,
        psm: 3,
      })
      return text
    } catch (error) {
      console.error("Error processing image with node-tesseract-ocr:", error)
      throw new Error("Failed to extract text from image.")
    }
  }
  throw new Error("Unsupported file type")
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set.")
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const mimeType = file.type
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const extractedText = await extractTextFromBuffer(fileBuffer, mimeType)

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract sufficient text from the document. The document might be empty, scanned as a low-quality image, or unreadable.",
        },
        { status: 400 }
      )
    }

    const prompt = `
      You are a helpful AI medical assistant. Analyze the following medical report text and provide a structured analysis. The user is a patient, so explain things in simple, clear language.

      Medical Report Text:
      """
      ${extractedText}
      """

      Provide the output in a valid JSON format with the following keys:
      - "keyFindings": An array of objects. Each object should have "label" (the test name, e.g., "Hemoglobin"), "value" (the result, e.g., "11.2 g/dL"), "status" (either "LOW", "NORMAL", "HIGH", or "BORDERLINE"), and "explanation" (a simple, one-sentence explanation of what this means for the patient).
      - "summary": A brief, easy-to-understand summary paragraph of the overall results. Explain what the findings mean together.
      - "nextSteps": An array of 2-4 recommended next steps for the patient. These should be actionable and clear.

      Example of a "keyFindings" object:
      {
        "label": "Hemoglobin",
        "value": "11.2 g/dL",
        "status": "LOW",
        "explanation": "This is slightly low and could indicate mild anemia."
      }

      Do not include any text or formatting outside of the main JSON object.
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Clean the response to ensure it's valid JSON
    const cleanedJson = responseText.replace(/```json|```/g, "").trim()

    // A simple check to prevent parsing errors if the model doesn't return JSON
    if (!cleanedJson.startsWith("{")) {
      console.error(
        "Gemini API did not return valid JSON. Response:",
        cleanedJson
      )
      throw new Error("The AI model returned an invalid response format.")
    }

    // Here, you would parse and validate the JSON from the model
    const analysis = JSON.parse(cleanedJson)

    return NextResponse.json(analysis)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error analyzing report:", error)
    return NextResponse.json(
      { error: error.message || "Failed to analyze report." },
      { status: 500 }
    )
  }
}
