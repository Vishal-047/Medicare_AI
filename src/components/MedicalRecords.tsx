"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MedicalRecordButtonProps {
  filename: string
}

export default function MedicalRecords({ filename }: MedicalRecordButtonProps) {
  return (
    <Link
      href={`/api/documents/${filename}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="outline">View Original Report</Button>
    </Link>
  )
}