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
  location: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
    default: null,
  },
  profile: String,
  lastLoggedIn: Date,
  lastLoggedOut: Date,
  machineId: {
    type: mongoose.Schema.ObjectId,
    ref: "Machine",
    default: null,
  },
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
    default: null,
  },
  partsId: {
    type: mongoose.Schema.ObjectId,
    ref: "Part",
    default: null,
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
