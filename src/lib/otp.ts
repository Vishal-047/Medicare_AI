import crypto from "crypto"

// For a real application, you would use an SMS service like Twilio
import Twilio from "twilio"

const twilio = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export function generateOtp(): string {
  // Generate a 6-digit OTP
  return crypto.randomInt(100000, 999999).toString()
}

export async function sendOtp(phoneNumber: string, otp: string): Promise<void> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.error("Twilio credentials are not set in environment variables.")
    console.log(
      `====== DEV ONLY: OTP Service ======\nSent OTP ${otp} to ${phoneNumber}\n=================================`
    )
    // Don't throw an error in dev, just log it.
    // This allows development to continue without a real Twilio account.
    return
  }

  try {
    // In a real app, you would uncomment and use this:
    await twilio.messages.create({
      body: `Your MediCare AI verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })
    console.log(`Successfully sent OTP to ${phoneNumber}`)
  } catch (error) {
    console.error("Failed to send OTP via Twilio:", error)
    // In a real app, you would have more robust error handling
    throw new Error("Could not send OTP.")
  }
} 