This is a Next.js project bootstrapped with create-next-app.

Getting Started
First:
npm install
then, run development server:
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
