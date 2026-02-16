## Medicare-AI – Project Workflow

### 1. High-Level Architecture

- **Frontend (Next.js App Router)**: React + TypeScript UI with Tailwind CSS and Radix UI components, handling routing, forms, and dashboards.
- **Backend (Next.js API Routes)**: Server-side routes under `src/app/api/**` for authentication, AI integration, medical-report processing, doctor search, and payments.
- **Database (MongoDB + Mongoose)**: Stores users (patients/doctors), medical records, documents, and doctor applications.
- **External Services**: Google Gemini AI (analysis), Poppler & Tesseract (PDF/image OCR), Stripe (payments), Twilio (SMS), Nodemailer (email), UploadThing (file uploads).

### 2. User Journey – Patient

1. **Onboarding & Auth**
   - Patient signs up with email/phone and password.
   - Backend creates a MongoDB user document, hashes password with bcrypt, and manages verification/OTP if configured.
   - NextAuth.js manages sessions and protected routes.

2. **Symptom Analysis (AI Chat)**
   - Patient opens the AI assistant and describes symptoms (multi-language supported).
   - Frontend sends conversation history to `POST /api/analyze-symptoms`.
   - Backend formats prompt (role: doctor, language, chat history) and calls Google Gemini.
   - Response is returned as an empathetic, structured analysis with follow-up questions and recommendations.

3. **Medical Report Analysis**
   - Patient uploads a PDF or image of a lab/medical report.
   - File is uploaded (UploadThing or form-data) to `POST /api/analyze-report`.
   - Backend:
     - Detects file type and extracts text using Poppler (PDF) or Tesseract (image).
     - Sends extracted text to Gemini with a medical-analysis prompt.
     - Returns structured findings, summary, and recommended next steps.
   - Results can be stored against the user’s medical records in MongoDB.

4. **Medical Records & Documents**
   - Patient dashboard lists stored documents and AI-analyzed medical records.
   - Records include metadata (type, date, diagnosis, doctor, status) and optional AI analysis.

5. **Find Doctors & Nearby Care**
   - Patient searches for doctors or care providers (e.g., specialty, location).
   - Frontend calls API routes under `api/find-providers` / `api/doctors` (depending on implementation).
   - Results are displayed in a doctor directory / map-style UI with filters.

6. **Payments & Premium Features**
   - For premium features, the frontend initiates a checkout session via `POST /api/create-checkout-session`.
   - Stripe handles the payment flow; webhooks (if configured) update user access or plan status.

### 3. User Journey – Doctor / Admin

1. **Doctor Onboarding**
   - Doctor submits an application via doctor onboarding forms.
   - Data is saved into `DoctorApplication` model in MongoDB via `api/doctor-onboarding` or similar routes.
   - Admin can review and approve applications through admin dashboards.

2. **Admin Operations**
   - Admin views pending doctor applications, user metrics, and usage analytics (where implemented).
   - Admin can manage users, doctors, and possibly moderate content.

### 4. AI & Document Processing Workflow

- **Symptom Chat**:
  - Conversation array (role + content) → formatted prompt → Gemini API → analysis text.
- **Report Analysis**:
  - Upload file → temporary storage → text extraction (Poppler/Tesseract) → Gemini prompt with raw text → structured JSON-like analysis → persisted to MongoDB as part of a medical record.

### 5. Local Development Workflow

1. Clone the repository and install dependencies: `npm install`.
2. Configure `.env.local` with MongoDB, Gemini, Stripe, Twilio, NextAuth, and other required keys.
3. Run the dev server: `npm run dev` and open `http://localhost:3000`.
4. Use the main dashboard to:
   - Sign up/login as a patient.
   - Test symptom analysis chat.
   - Upload sample medical reports for AI analysis.
   - Explore doctor directory and other modules (health monitoring, records, etc.).

