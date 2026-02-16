import { Schema, model, models, Document, Model } from "mongoose"

export interface IMedicalRecord extends Document {
  type: string
  diagnosis: string
  doctor?: string
  status?: string
  date: Date
  originalReportUrl?: string
  analysis?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyFindings: any
    summary: string
    nextSteps: string[]
  }
}

export interface IUser extends Document {
  name: string
  email: string
  password: string
  phoneNumber: string
  role: "patient" | "doctor"
  isVerified: boolean
  otp?: string | null
  otpExpires?: Date | null
  createdAt: Date
  updatedAt: Date
  location?: {
    type: "Point"
    coordinates: [number, number] // [longitude, latitude]
  }
  medicalHistory: IMedicalRecord[]
  documents: IDocument[]
}

export interface IDocument extends Document {
  name: string
  type: string
  date: Date
  size: number
  category: string
  url: string
}

const DocumentSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },
  size: { type: Number, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
})

const MedicalRecordSchema = new Schema({
  type: { type: String, required: true },
  diagnosis: { type: String, required: true },
  doctor: { type: String },
  status: { type: String },
  date: { type: Date, default: Date.now },
  originalReportUrl: {
    type: String,
  },
  analysis: {
    keyFindings: Schema.Types.Mixed,
    summary: String,
    nextSteps: [String],
  },
})

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor"],
      default: "patient",
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },
    medicalHistory: [MedicalRecordSchema],
    documents: [DocumentSchema],
  },
  { timestamps: true }
)

userSchema.index({ location: "2dsphere" })

const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema)

export default User
