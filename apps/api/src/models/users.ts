import mongoose from "mongoose"
const { Schema } = mongoose

const users = new Schema({
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ["Administrator", "Corporate", "Production", "Personnel"],
  },
  email: String,
  password: String,
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  profile: {
    type: Object,
    default: null,
  },
  lastLoggedIn: Date,
  lastLoggedOut: Date,
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  blockedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("User", users)
