import mongoose from "mongoose"
const { Schema } = mongoose

const users = new Schema({
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: [
      "Super",
      "Administrator",
      "Corporate",
      "Production",
      "Personnel",
      "HR",
      "Accounting",
      "Sales",
    ],
  },
  email: String,
  password: String,
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  factoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Factory",
  },
  isGlobalFactory: Boolean,
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
  status: {
    type: String,
    enum: ["Approved", "Rejected", "Archived", "Blocked", "Requested"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("User", users)
