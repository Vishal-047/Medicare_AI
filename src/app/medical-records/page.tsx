"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Download,
  Upload,
  Calendar,
  User,
  DollarSign,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import Header from "@/components/Header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useSession } from "next-auth/react"
import AuthModal from "@/components/AuthModal"
import { Poppins, Inter } from "next/font/google"
import FileUpload from "@/components/FileUpload"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

const poppins = Poppins({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-poppins",
})
const inter = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-inter",
})

interface MedicalRecord {
  _id: string
  date: string
  type: string
  doctor: string
  diagnosis: string
  status: string
  originalReportUrl?: string
  analysis?: {
    keyFindings: {
      label: string
      value: string
      status: string
      explanation: string
    }[]
    summary: string
    nextSteps: string[]
  }
}

interface IDocument {
  _id: string
  name: string
  type: string
  date: string
  size: number
  category: string
  url: string
}

type Bill = {
  id: number
  date: string
  provider: string
  service: string
  amount: number
  insurance: number
  balance: number
  status: string
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

const MedicalRecords = () => {
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([])
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false)
  const [addRecordLoading, setAddRecordLoading] = useState(false)
  const [addRecordError, setAddRecordError] = useState<string | null>(null)
  const [addRecordSuccess, setAddRecordSuccess] = useState<string | null>(null)
  const [recordFile, setRecordFile] = useState<File | null>(null)
  const [recordDiagnosis, setRecordDiagnosis] = useState("")
  const [recordDoctor, setRecordDoctor] = useState("")
  const [recordType, setRecordType] = useState("")
  const [recordStatus, setRecordStatus] = useState("")
  const [payingBillId, setPayingBillId] = useState<number | null>(null)

  const bills = [
    {
      id: 1,
      date: "2024-01-15",
      provider: "City General Hospital",
      service: "Annual Physical Exam",
      amount: 250.0,
      insurance: 200.0,
      balance: 50.0,
      status: "Paid",
    },
    {
      id: 2,
      date: "2023-12-08",
      provider: "Advanced Cardiac Center",
      service: "Blood Panel & Lab Work",
      amount: 180.0,
      insurance: 144.0,
      balance: 36.0,
      status: "Outstanding",
    },
    {
      id: 3,
      date: "2023-11-22",
      provider: "Community Health Clinic",
      service: "Consultation & Prescription",
      amount: 120.0,
      insurance: 96.0,
      balance: 24.0,
      status: "Paid",
    },
  ]

  const fetchRecords = async () => {
    if (status === "authenticated") {
      try {
        setIsLoading(true)
        const response = await fetch("/api/medical-records")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch records")
        }
        const data = await response.json()
        setMedicalHistory(data.medicalHistory)
        setDocuments(data.documents)
      } catch (error: any) {
        console.error("Failed to fetch medical records:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    } else if (status === "unauthenticated") {
      setIsLoading(false)
      setError(null) // Clear any previous error
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [status])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Active":
      case "Outstanding":
        return "bg-yellow-100 text-yellow-800"
      case "Reviewed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRecords = medicalHistory.filter(
    (record) =>
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBills = bills.filter(
    (bill) =>
      bill.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.provider.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Next Appointment (placeholder, replace with real data if available)
  const nextAppointment = {
    doctor: "Dr. Johnson",
    date: "2025-02-28",
  }

  // New Documents This Month
  const newDocumentsCount = documents.filter((doc) => {
    const docDate = new Date(doc.date)
    return (
      docDate.getMonth() === currentMonth &&
      docDate.getFullYear() === currentYear
    )
  }).length

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddRecordError(null)
    setAddRecordSuccess(null)
    if (!recordFile) {
      setAddRecordError("Please select a report file to upload.")
      return
    }
    setAddRecordLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", recordFile)
      formData.append(
        "recordData",
        JSON.stringify({
          diagnosis: recordDiagnosis,
          doctor: recordDoctor,
          type: recordType,
          status: recordStatus,
        })
      )
      const response = await fetch("/api/medical-records", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add record")
      }
      setAddRecordSuccess("Record added successfully!")
      setIsAddRecordOpen(false)
      setRecordFile(null)
      setRecordDiagnosis("")
      setRecordDoctor("")
      setRecordType("")
      setRecordStatus("")
      fetchRecords()
    } catch (error: any) {
      setAddRecordError(error.message || "Failed to add record.")
    } finally {
      setAddRecordLoading(false)
    }
  }

  const handleCheckout = async (bill: Bill) => {
    setPayingBillId(bill.id)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: bill.service,
          provider: bill.provider,
          balance: bill.balance,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.json()
        throw new Error(errorBody.error || "Failed to create payment session.")
      }

      const { session } = await response.json()
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe.js has not loaded yet.")
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (error) {
        toast.error(error.message || "An error occurred during redirection.")
      }
    } catch (err: any) {
      toast.error(err.message || "Could not initiate payment.")
    } finally {
      setPayingBillId(null)
    }
  }

  return (
    <div
      className={`min-h-screen relative ${inter.variable} ${poppins.variable} bg-background dark:bg-[#181A1B]`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, var(--grid-color, #E9ECEF) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color, #E9ECEF) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.5,
        }}
      />
      {/* Watermark symbol */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 flex items-center justify-center z-0"
        style={{
          fontSize: "18vw",
          color: "var(--watermark-color, #A0AEC0)",
          opacity: 0.04,
          fontWeight: 700,
          userSelect: "none",
        }}
      >
        &#9877;
      </div>
      <style jsx global>{`
        html.light {
          --grid-color: #e9ecef;
          --watermark-color: #a0aec0;
        }
        html.dark {
          --grid-color: #23272b;
          --watermark-color: #4a5568;
        }
      `}</style>
      <div className="relative z-10">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Dashboard Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-semibold text-foreground mb-2 font-poppins text-center">
              Your Health Dashboard
            </h1>
            <p className="text-lg text-foreground font-inter font-normal text-center mb-8">
              A complete, secure overview of your medical journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-card border border-border p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="text-sm text-foreground font-semibold mb-1">
                    Next Appointment
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    {nextAppointment.doctor}
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {nextAppointment.date
                      ? new Date(nextAppointment.date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )
                      : "No upcoming"}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-card border border-border p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="text-sm text-foreground font-semibold mb-1">
                    New Documents
                  </div>
                  <div className="text-xs text-muted-foreground mb-4">
                    Uploaded this month
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {newDocumentsCount}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-black text-white p-6 flex flex-col justify-between shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-neutral-900">
                <div>
                  <div className="text-sm font-semibold mb-1">
                    Add New Record
                  </div>
                  <div className="text-xs mb-4">
                    Upload a report or add an entry.
                  </div>
                  <Button
                    className="w-full bg-white text-black font-semibold mt-2 flex items-center justify-center gap-2 border border-black shadow transition-all duration-200 hover:bg-gray-100 hover:border-black hover:shadow-lg cursor-pointer"
                    onClick={() => setIsAddRecordOpen(true)}
                    disabled={status !== "authenticated"}
                  >
                    Add Record <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="bg-card rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search records, bills, or documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-foreground placeholder:text-muted-foreground bg-background border border-border"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <FileUpload
                  onUploadSuccess={(files: File[]) => {
                    // TODO: handle file upload logic here, e.g., upload to server and update documents
                    // Example: setDocuments(prevDocs => [...files, ...prevDocs])
                  }}
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="history" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Medical History</TabsTrigger>
              <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Medical History Tab */}
            <TabsContent value="history" className="space-y-4">
              {status === "loading" || isLoading ? (
                <p>Loading...</p>
              ) : status === "unauthenticated" ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-semibold mb-2">
                    Please sign in to view your records.
                  </h3>
                  <p className="text-foreground mb-4 font-inter font-normal">
                    Your medical history is private and secure.
                  </p>
                  <Button onClick={() => setIsAuthModalOpen(true)}>
                    Sign In or Sign Up
                  </Button>
                </div>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : (
                filteredRecords.map((record) => (
                  <Card
                    key={record._id}
                    className="hover:shadow-lg hover:scale-[1.015] transition-all duration-200 bg-card"
                  >
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                      <div>
                        <CardTitle className="text-lg font-poppins font-semibold text-foreground">
                          {record.diagnosis}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1 font-inter font-normal text-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {record.date}
                          </span>
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {record.doctor}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <Badge variant="outline">{record.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-4 font-inter font-normal">
                        {record.analysis?.summary || "No summary available."}
                      </p>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4 mr-2" />
                              View AI Analysis
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{record.diagnosis}</DialogTitle>
                              <DialogDescription>
                                AI-generated analysis from{" "}
                                {new Date(record.date).toLocaleDateString(
                                  "en-US"
                                )}
                              </DialogDescription>
                            </DialogHeader>
                            {record.analysis ? (
                              <div className="space-y-6 text-sm py-4 max-h-[70vh] overflow-y-auto">
                                <div>
                                  <h4 className="font-semibold text-base mb-2">
                                    Summary
                                  </h4>
                                  <p className="text-foreground font-inter font-normal">
                                    {record.analysis.summary ||
                                      "No summary available."}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-base mb-2">
                                    Key Findings
                                  </h4>
                                  {Array.isArray(record.analysis.keyFindings) &&
                                  record.analysis.keyFindings.length > 0 ? (
                                    <ul className="space-y-2">
                                      {record.analysis.keyFindings.map(
                                        (finding, index) => (
                                          <li
                                            key={index}
                                            className="p-2 rounded-md bg-gray-50 dark:bg-gray-800/50"
                                          >
                                            <p>
                                              <strong>{finding.label}:</strong>{" "}
                                              {finding.value} ({finding.status})
                                            </p>
                                            <p className="text-xs text-foreground font-inter font-normal">
                                              {finding.explanation}
                                            </p>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    <p>No key findings available.</p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-base mb-2">
                                    Next Steps
                                  </h4>
                                  {Array.isArray(record.analysis.nextSteps) &&
                                  record.analysis.nextSteps.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-foreground font-inter font-normal">
                                      {record.analysis.nextSteps.map(
                                        (step, index) => (
                                          <li key={index}>{step}</li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    <p>No next steps available.</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p>
                                No detailed analysis available for this record.
                              </p>
                            )}
                          </DialogContent>
                        </Dialog>

                        {record.originalReportUrl && (
                          <Button asChild size="sm" variant="secondary">
                            <Link
                              href={`/api/reports/${record.originalReportUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              View Original Report
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Bills Tab */}
            <TabsContent value="bills" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card key="total-paid">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      $74.00
                    </div>
                    <div className="text-foreground">Total Paid</div>
                  </CardContent>
                </Card>
                <Card key="outstanding">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      $36.00
                    </div>
                    <div className="text-foreground">Outstanding</div>
                  </CardContent>
                </Card>
                <Card key="insurance-covered">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      $440.00
                    </div>
                    <div className="text-foreground">Insurance Covered</div>
                  </CardContent>
                </Card>
              </div>

              {filteredBills.map((bill) => (
                <Card
                  key={bill.id}
                  className="hover:shadow-lg hover:scale-[1.015] transition-all duration-200 bg-card"
                >
                  <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-lg font-poppins font-semibold text-foreground">
                        {bill.service}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1 font-inter font-normal text-foreground">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {bill.date}
                        </span>
                        <span>{bill.provider}</span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          Total Amount
                        </div>
                        <div className="font-semibold">
                          ${bill.amount.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Insurance</div>
                        <div className="font-semibold text-green-600">
                          ${bill.insurance.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Your Balance
                        </div>
                        <div className="font-semibold text-blue-600">
                          ${bill.balance.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-end">
                        {bill.status === "Outstanding" && (
                          <Button
                            size="sm"
                            className="w-full font-inter font-normal"
                            onClick={() => handleCheckout(bill)}
                            disabled={payingBillId === bill.id}
                          >
                            {payingBillId === bill.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <DollarSign className="w-4 h-4 mr-2" />
                            )}
                            {payingBillId === bill.id
                              ? "Redirecting..."
                              : "Pay Now"}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        View Bill
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              {filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc) => (
                    <Card
                      key={doc._id}
                      className="hover:shadow-lg hover:scale-[1.015] transition-all duration-200 bg-card"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <Badge variant="outline">{doc.category}</Badge>
                        </div>
                        <CardTitle className="text-base truncate font-poppins font-semibold text-foreground">
                          {doc.name}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center justify-between text-xs">
                            <span>
                              {new Date(doc.date).toLocaleDateString("en-US")}
                            </span>
                            <span>
                              {(doc.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex space-x-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="flex-1 font-inter font-normal"
                          >
                            <Link
                              href={`/api/documents/${doc.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="flex-1 font-inter font-normal"
                          >
                            <Link
                              href={`/api/documents/${doc.url}`}
                              download={doc.name}
                            >
                              <Download className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-foreground font-inter font-normal">
                    No records to be shown.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen} />
      <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Medical Record</DialogTitle>
            <DialogDescription>
              Upload a report and enter details for your medical record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRecord} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Report File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setRecordFile(e.target.files?.[0] || null)}
                className="block w-full border border-border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Diagnosis
              </label>
              <Input
                value={recordDiagnosis}
                onChange={(e) => setRecordDiagnosis(e.target.value)}
                placeholder="e.g. Diabetes Mellitus"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Doctor</label>
              <Input
                value={recordDoctor}
                onChange={(e) => setRecordDoctor(e.target.value)}
                placeholder="e.g. Dr. Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Input
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                placeholder="e.g. Lab Report, Prescription"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Input
                value={recordStatus}
                onChange={(e) => setRecordStatus(e.target.value)}
                placeholder="e.g. Completed, Active"
              />
            </div>
            {addRecordError && (
              <p className="text-red-500 text-sm">{addRecordError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddRecordOpen(false)}
                disabled={addRecordLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addRecordLoading}>
                {addRecordLoading ? "Uploading..." : "Add Record"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MedicalRecords
