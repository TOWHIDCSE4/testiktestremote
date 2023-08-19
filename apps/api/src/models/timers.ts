import mongoose from "mongoose"
const { Schema } = mongoose

const timers = new Schema({
  factoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Factory",
  },
  machineId: {
    type: mongoose.Schema.ObjectId,
    ref: "Machine",
  },
  machineClassId: {
    type: mongoose.Schema.ObjectId,
    ref: "MachineClass",
  },
  partId: {
    type: mongoose.Schema.ObjectId,
    ref: "Part",
  },
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("Timer", timers)
