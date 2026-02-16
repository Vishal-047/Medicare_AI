## Medicare-AI – AI-Powered Healthcare Management Platform

Medicare-AI is a full-stack healthcare management platform that uses AI to help patients understand their symptoms and medical reports, manage health records, and find nearby doctors, with a strong focus on usability and data privacy.

- **Objective**: Build an AI-driven platform that simplifies medical report understanding, supports multi-language symptom analysis, and connects patients with healthcare providers—making healthcare more accessible and personalized.
- **Key Features**:
  - AI-powered symptom analysis and conversational medical guidance using Google Gemini AI
  - Medical report upload (PDF/images) with OCR (Poppler + Tesseract) and structured AI analysis
  - Secure medical records and document management for patients
  - Doctor directory and nearby doctor search with location-aware filtering
  - Health monitoring dashboards and patient-friendly insights
  - Multi-language support for Indian languages (e.g., English, Hindi, Marathi, Gujarati, Tamil, Telugu)
  - Payments for premium features via Stripe, with email/SMS notifications

## Tech Stack (One Line)

Next.js, React, TypeScript, Tailwind CSS, MongoDB, Google Gemini AI, Stripe, Twilio, Node.js, Radix UI, Framer Motion, React Hook Form, Chart.js, NextAuth.js, bcrypt, Poppler, Tesseract OCR, UploadThing, Nodemailer, ESLint

## Getting Started (Development)

1. **Install dependencies**:

```bash
npm install
```

2. **Set environment variables** (create a `.env.local` file) for:

- `MONGODB_URI`
- `GEMINI_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (if applicable)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` (if SMS is enabled)
- Any other keys used for uploads and email (e.g., UploadThing, Nodemailer)

3. **Run the development server**:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the result.
```

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.

Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.
You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.

Then open `http://localhost:3000` in your browser.

For a more detailed explanation of the internal flows and architecture, see `workflow.md`.

## Backend Architecture

- **Framework**: Next.js App Router (`src/app/api/*`) with serverless API routes deployed on Vercel.
- **Language & Runtime**: TypeScript on Node.js.
- **Database**: MongoDB Atlas, accessed via Mongoose (`src/lib/db.ts`, `src/models/*`).
- **Auth**: NextAuth.js with credentials strategy and JWT sessions.
- **AI Layer**: Google Gemini (via `@google/generative-ai`) used in `/api/analyze-symptoms` and `/api/analyze-report`.
- **Background / Heavy Work**: PDF and image processing using Poppler and Tesseract OCR in the `analyze-report` route.
- **Infrastructure Overview**:
  - Client (Next.js pages + components) → Next.js API Route → Service/Lib layer (`src/lib`, `src/services`) → MongoDB / External APIs (Gemini, Stripe, Twilio).

## API Endpoint Documentation (High Level)

> All endpoints are under the Next.js App Router in `src/app/api`. Most accept/return JSON and are meant to be called from the frontend.

- **Auth & Users**
  - `POST /api/auth/login` – Authenticate user (NextAuth handler).
  - `POST /api/signup` – Register a new patient/doctor.
  - `GET /api/users/me` – Get the currently authenticated user.

- **AI & Analysis**
  - `POST /api/analyze-symptoms` – Takes a conversation array and language code; returns AI doctor-style response.
  - `POST /api/analyze-report` – Accepts a PDF/image file; extracts text, sends it to Gemini, and returns structured report analysis.

- **Medical Records & Documents**
  - `GET /api/medical-records` – Fetch user’s medical records from MongoDB.
  - `POST /api/medical-records` – Create a new medical record entry (optionally with AI analysis metadata).
  - `GET /api/documents` – List uploaded medical documents.
  - `POST /api/documents` – Save metadata for newly uploaded documents (UploadThing or similar).

- **Doctors & Care**
  - `GET /api/doctors` – List doctors for directory / search.
  - `POST /api/doctor-applications` – Submit a doctor onboarding application.
  - `GET /api/find-providers` – Find nearby providers by location/speciality.

- **Payments & Billing**
  - `POST /api/create-checkout-session` – Creates a Stripe Checkout Session for premium features.

## System Design Overview

- **Client Layer**
  - Next.js pages under `src/app` for core flows like AI analysis, speech analysis, health monitoring, medical records, doctor directory, and help-center.
  - Reusable UI components in `src/components` using Tailwind CSS and Radix UI.

- **Service / Business Layer**
  - Shared logic for DB access, email/OTP, and admin utilities in `src/lib`.
  - (Planned) service abstraction in `src/services` to group domain logic (patient services, doctor services, billing services, AI services).

- **Data & Integration Layer**
  - MongoDB models in `src/models` for `User`, `DoctorApplication`, and `Admin`.
  - External integrations for:
    - AI (Gemini),
    - Storage/Uploads,
    - Email (Nodemailer),
    - SMS (Twilio),
    - Payments (Stripe).

### Simple Request Flow (Example – Analyze Report)

1. User uploads a PDF on the frontend.
2. Frontend `POST`s the file to `/api/analyze-report`.
3. API route:
   - Parses file, detects MIME type.
   - Uses Poppler / Tesseract to extract text.
   - Sends text with a medical prompt to Gemini.
   - Returns structured key findings, summary, and next steps.
4. Optionally persists the analysis as a medical record for the logged-in user.

## Services Layer (Overview)

This folder is reserved for **service modules** that encapsulate business logic and orchestrate calls between:

- MongoDB models (in `src/models`)
- Utility libraries (in `src/lib`)
- External APIs (Gemini, Stripe, Twilio, etc.)

Suggested structure:

```text
src/services/
  ai/
    symptomService.ts          # Wraps symptom analysis prompts and Gemini calls
    reportAnalysisService.ts   # Wraps report OCR + Gemini logic
  medical/
    medicalRecordService.ts    # CRUD + business rules for medical records
    documentService.ts         # Document metadata + uploads
  user/
    authService.ts             # Login/registration/verification helpers
    userService.ts             # User profile operations
  billing/
    paymentService.ts          # Stripe checkout + webhooks handling
```

As you refactor, import services inside your API route handlers instead of implementing heavy logic directly in the route files. This makes the codebase easier to test, reuse, and explain in interviews.

## Database Schema Example (Mongoose)

Below is a simplified example of the `User` + `MedicalRecord` schema (see `src/models/User.ts` for full details):

```ts
import mongoose, { Schema, Document } from "mongoose";

interface IMedicalRecord extends Document {
  type: string;
  diagnosis: string;
  doctor?: string;
  status?: string;
  date: Date;
  originalReportUrl?: string;
  analysis?: {
    keyFindings: any;
    summary: string;
    nextSteps: string[];
  };
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "patient" | "doctor";
  isVerified: boolean;
  medicalHistory: IMedicalRecord[];
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  type: { type: String, required: true },
  diagnosis: { type: String, required: true },
  doctor: String,
  status: String,
  date: { type: Date, default: Date.now },
  originalReportUrl: String,
  analysis: {
    keyFindings: Schema.Types.Mixed,
    summary: String,
    nextSteps: [String],
  },
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ["patient", "doctor"], default: "patient" },
  password: { type: String, required: true, minlength: 8 },
  isVerified: { type: Boolean, default: false },
  medicalHistory: [MedicalRecordSchema],
});
```

## API Documentation (Swagger) – Optional Enhancement

To make this project even stronger for interviews and collaboration, you can add auto‑generated API docs:

1. Install a Swagger helper for Next.js, for example:

```bash
npm install swagger-ui-react swagger-jsdoc
```

2. Create an OpenAPI definition (e.g. `src/lib/openapi.ts`) describing your main routes.
3. Add a Next.js route like `/api-docs` that serves the JSON spec.
4. Create a page `/api-docs/ui` that renders `<SwaggerUI>` pointed at your JSON spec.

Once set up, you’ll have interactive documentation where anyone can explore and test your endpoints directly from the browser.
