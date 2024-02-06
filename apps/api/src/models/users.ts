import mongoose from "mongoose"
import { EUserPinnedComponents } from "custom-validator"
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
  pinnedComponentsDashboard: [
    {
      type: String,
      enum: [
        EUserPinnedComponents.perMachine,
        EUserPinnedComponents.perMachinePerLocation,
        EUserPinnedComponents.factoryOutlook,
      ],
    },
  ],
  pinnedComponentsPopup: [
    {
      type: String,
      enum: [
        EUserPinnedComponents.perMachine,
        EUserPinnedComponents.perMachinePerLocation,
        EUserPinnedComponents.factoryOutlook,
      ],
    },
  ],
  defaultSettings: {
    viewMode: String,
    locations: Array<String>,
    machineClasses: Array<String>
  },
  email: { type: String, lowercase: true },
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
    default: {},
  },
  lastLoggedIn: Date,
  lastLoggedOut: Date,
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  archivedBy: {
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
