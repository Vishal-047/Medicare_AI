import { Schema, model, models, Document } from "mongoose"

export interface IAdmin extends Document {
  name: string
  email: string
  phoneNumber: string
  password: string
  isVerified: boolean
  otp?: string | null
  otpExpires?: Date | null
  createdAt: Date
  updatedAt: Date
}

const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
)

const Admin = models.Admin || model<IAdmin>("Admin", adminSchema)

export default Admin
