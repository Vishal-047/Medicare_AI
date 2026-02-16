"use client"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import Header from "@/components/Header"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  X,
  ArrowRight,
  Plus,
  FileText,
  Image as ImageIcon,
  FileUp,
  Lightbulb,
  List,
  FlaskConical,
} from "lucide-react"
import { useSession } from "next-auth/react"
import AuthModal from "@/components/AuthModal"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"
import Link from "next/link"

interface KeyFinding {
  label: string
  value: string
  status: "NORMAL" | "LOW" | "HIGH" | "BORDERLINE"
  explanation: string
}

interface AnalysisResult {
  keyFindings: KeyFinding[]
  summary: string
  nextSteps: string[]
  originalReportUrl?: string
}

function getStatusVisuals(status: KeyFinding["status"]) {
  switch (status) {
    case "LOW":
      return {
        icon: <XCircle className="text-red-500 w-4 h-4 mr-1 inline" />,
        tag: (
          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs ml-2">
            LOW
          </span>
        ),
      }
    case "HIGH":
      return {
        icon: <XCircle className="text-red-500 w-4 h-4 mr-1 inline" />,
        tag: (
          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs ml-2">
            HIGH
          </span>
        ),
      }
    case "BORDERLINE":
      return {
        icon: <AlertTriangle className="text-yellow-500 w-4 h-4 mr-1 inline" />,
        tag: (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs ml-2">
            BORDERLINE
          </span>
        ),
      }
    case "NORMAL":
    default:
      return {
        icon: <CheckCircle className="text-green-500 w-4 h-4 mr-1 inline" />,
        tag: (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs ml-2">
            NORMAL
          </span>
        ),
      }
  }
}

function getFileTypeIcon(type: string) {
  if (type.startsWith("image/"))
    return <ImageIcon className="w-4 h-4 text-blue-500 mr-1" />
  if (type === "application/pdf")
    return <FileText className="w-4 h-4 text-red-500 mr-1" />
  return <FileText className="w-4 h-4 text-gray-400 mr-1" />
}

export default function AIReportAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [saveOriginal, setSaveOriginal] = useState(true)
  const [saveOnlyOriginal, setSaveOnlyOriginal] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { data: session, status } = useSession()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      if (
        selectedFile.type.startsWith("image/") ||
        selectedFile.type === "application/pdf"
      ) {
        setFile(selectedFile)
        setError(null)
        setAnalysisResult(null)
      } else {
        toast.error("Unsupported File Type", {
          description: "Please upload an image or a PDF file.",
        })
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      "application/pdf": [".pdf"],
    },
  })

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)
    setAnalysisResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/analyze-report", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Analysis failed")
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveRecord = async () => {
    if (status === "unauthenticated") {
      setIsAuthModalOpen(true)
      return
    }

    if (!file || status !== "authenticated") return
    if (!saveOnlyOriginal && !analysisResult) return

    setIsSaving(true)

    const formData = new FormData()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recordData: any = {
      type: "Lab Results",
      doctor: "AI Analyzer",
      status: "Reviewed",
      date: new Date(),
    }
    if (saveOnlyOriginal) {
      recordData.diagnosis = file.name || "Uploaded Report"
    } else {
      recordData.diagnosis = `AI Analysis: ${analysisResult?.keyFindings[0]?.label || "Report"
        }`
      recordData.analysis = analysisResult
    }

    if (file) {
      recordData.originalReportUrl = file.name
    }

    formData.append("recordData", JSON.stringify(recordData))
    if ((saveOriginal || saveOnlyOriginal) && file) {
      formData.append("file", file)
    }

    try {
      const response = await fetch("/api/medical-records", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to save the record.")
      }

      const savedRecord = await response.json()

      // Update the analysis result to include the correct URL
      if (savedRecord.originalReportUrl) {
        setAnalysisResult((prev) => {
          if (!prev) return null
          return {
            ...prev,
            originalReportUrl: savedRecord.originalReportUrl,
          }
        })
      }

      toast("Record Saved!", {
        description: saveOnlyOriginal
          ? "The original report has been added to your medical history."
          : "The AI analysis has been added to your medical history.",
      })
    } catch (error) {
      toast.error("Error", {
        description: "Could not save the record. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
              AI Medical Report Analyzer
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Get instant, easy-to-understand analysis of your medical reports.
              Upload a PDF or image to get started.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Your Report</CardTitle>
              <CardDescription>
                Drag and drop your file here or click to browse. Supports PDF,
                PNG, JPG, and GIF.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ease-in-out ${isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                  <FileUp
                    className={`w-16 h-16 ${isDragActive ? "text-blue-600" : "text-gray-400"
                      }`}
                  />
                  {isDragActive ? (
                    <p className="text-lg font-semibold text-blue-600">
                      Drop the file here...
                    </p>
                  ) : (
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      Drag & drop a file here, or click to select a file
                    </p>
                  )}
                </div>
              </div>

              {file && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileTypeIcon(file.type)}
                    <span className="font-medium text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !file}
                      size="sm"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Report"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isAnalyzing && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis in Progress...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-500/50 bg-red-50 dark:bg-red-900/10">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Analysis Error
                </CardTitle>
              </CardHeader>
              <CardContent className="text-red-700 dark:text-red-400">
                <p>{error}</p>
              </CardContent>
            </Card>
          )}

          {analysisResult && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {analysisResult.summary}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FlaskConical className="w-6 h-6 mr-2 text-blue-400" />
                    Key Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.keyFindings.map((finding, index) => (
                      <li
                        key={index}
                        className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            {getStatusVisuals(finding.status).icon}
                            {finding.label}
                          </span>
                          <div>
                            <span className="font-mono text-sm">
                              {finding.value}
                            </span>
                            {getStatusVisuals(finding.status).tag}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 pl-5">
                          {finding.explanation}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <List className="w-6 h-6 mr-2 text-green-400" />
                    Recommended Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {analysisResult.nextSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="save-original"
                          checked={saveOriginal}
                          onCheckedChange={(checked) =>
                            setSaveOriginal(Boolean(checked))
                          }
                          disabled={saveOnlyOriginal}
                        />
                        <label
                          htmlFor="save-original"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Save original report
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="save-only-original"
                          checked={saveOnlyOriginal}
                          onCheckedChange={(checked) => {
                            setSaveOnlyOriginal(Boolean(checked))
                            if (checked) setSaveOriginal(false)
                          }}
                          disabled={!saveOriginal && !saveOnlyOriginal && !file}
                        />
                        <label
                          htmlFor="save-only-original"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Save only the original report (do not store AI
                          analysis)
                        </label>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center space-x-4">
                      <Button onClick={handleSaveRecord} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        Save to My Records
                      </Button>
                      {file && analysisResult?.originalReportUrl && (
                        <Button variant="secondary" asChild>
                          <Link
                            href={`/api/reports/${analysisResult.originalReportUrl}`}
                            target="_blank"
                          >
                            View Original Report
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} />
    </>
  )
}
