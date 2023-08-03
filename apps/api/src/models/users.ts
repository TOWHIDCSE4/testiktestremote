import mongoose from "mongoose"
const { Schema } = mongoose

const users = new Schema({
  first_name: String,
  lastName: String,
  role: {
    type: String,
    enum: ["user", "admin"],
  },
  email: String,
  password: String,
  location: String,
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
