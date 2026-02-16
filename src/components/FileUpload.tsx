"use client"
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface FileUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadSuccess: (newDocument: any) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles?: File[]) => {
    console.log('onDrop called with:', acceptedFiles);
    if (!acceptedFiles || !Array.isArray(acceptedFiles) || acceptedFiles.length === 0) {
      toast.error("No valid files selected.");
      return;
    }

    setIsUploading(true);
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/medical-records", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const newDocument = await response.json();
      toast.success("File uploaded successfully!");
      onUploadSuccess(newDocument);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button
        disabled={isUploading}
        className="text-foreground bg-muted dark:bg-[#23272B] border border-border transition-all duration-200 hover:bg-muted/80 hover:shadow-md dark:hover:bg-[#23272B]/80 cursor-pointer"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : isDragActive ? "Drop here..." : "Upload Document"}
      </Button>
    </div>
  );
}

export function GridPattern() {
  const columns = 41
  const rows = 11
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                }`}
            />
          )
        })
      )}
    </div>
  )
}

