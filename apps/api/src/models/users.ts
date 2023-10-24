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
      "HR_Director",
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
  machineClassId: {
    type: mongoose.Schema.ObjectId,
    ref: "MachineClass",
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
    enum: ["Approved", "Rejected", "Archived", "Blocked", "Pending"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("User", users)
