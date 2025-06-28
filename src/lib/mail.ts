import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
}

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}

const transporter = nodemailer.createTransport(smtpConfig)

async function sendEmail({ to, subject, html }: EmailOptions) {
  // In a development environment without SMTP creds, log email to console
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.log("====== DEV ONLY: Email Service ======")
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log("Body:\n" + html)
    console.log("=====================================")
    return
  }

  try {
    await transporter.sendMail({
      from: `"Medicare AI" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
    console.log(`Email sent successfully to ${to}`)
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error)
    // In a real app, you would have more robust error handling
    throw new Error("Could not send email.")
  }
}

function getEmailContent(
  doctorName: string,
  status: "approved" | "rejected",
  doctorId?: string,
  doctorEmail?: string
) {
  if (status === "approved") {
    return {
      subject: "Congratulations! Your Application has been Approved",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #2c3e50;">Welcome to Medicare AI!</h1>
          <p>Dear Dr. ${doctorName},</p>
          <p>We are thrilled to inform you that your application to join our network of trusted healthcare professionals has been <strong>approved</strong>.</p>
          <p>Your profile is now live and you can start connecting with patients.</p>
          <a href="${
            process.env.NEXT_PUBLIC_APP_URL
          }/doctor/onboarding?email=${encodeURIComponent(
        doctorEmail || ""
      )}" style="display: inline-block; background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Continue to your dashboard
          </a>
          <p style="margin-top: 30px; font-size: 0.9em; color: #7f8c8d;">Thank you for joining us in our mission to make healthcare more accessible.</p>
          <p style="font-size: 0.9em; color: #7f8c8d;">Best regards,<br/>The Medicare AI Team</p>
        </div>
      `,
    }
  } else {
    // rejected
    return {
      subject: "Update on Your Medicare AI Application",
      html: `
       <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #2c3e50;">Application Update</h1>
          <p>Dear Dr. ${doctorName},</p>
          <p>Thank you for your interest in joining the Medicare AI network. After careful review of your application, we regret to inform you that we are unable to proceed at this time.</p>
          <p>We receive a high volume of applications and this decision does not reflect on your professional qualifications. We wish you the best in your future endeavors.</p>
          <p style="margin-top: 30px; font-size: 0.9em; color: #7f8c8d;">Sincerely,<br/>The Medicare AI Team</p>
        </div>
      `,
    }
  }
}

export async function sendApplicationStatusEmail(
  to: string,
  doctorName: string,
  status: "approved" | "rejected",
  doctorId?: string
) {
  // Find the application to get the email for the onboarding link
  let doctorEmail = to
  if (status === "approved") {
    // Try to get the application email if possible
    // (Assume to is the email, but you can adjust if needed)
    doctorEmail = to
  }
  const { subject, html } = getEmailContent(
    doctorName,
    status,
    doctorId,
    doctorEmail
  )
  await sendEmail({ to, subject, html })
}
