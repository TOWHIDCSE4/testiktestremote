import mongoose from "mongoose"
const { Schema } = mongoose

const machines = new Schema({
  name: String,
  factoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Factory",
  },
  machineClassId: {
    type: mongoose.Schema.ObjectId,
    ref: "MachineClass",
  },
  files: {
    type: Array,
    default: [],
  },
  description: String,
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("Machine", machines)
