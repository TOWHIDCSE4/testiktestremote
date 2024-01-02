import mongoose from "mongoose"
const { Schema } = mongoose

const devOpsTimers = new Schema({
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
  operatorName: {
    type: String,
    nullable: true,
  },
  operator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["STOP", "RUNNING", "PAUSED"],
    default: "STOP",
  },
  endAt: {
    type: Date,
    default: Date.now,
  },
  cycleTime: {
    type: Number,
    default: 0,
  },
  units: {
    type: Number,
    default: 0,
  },
  startAt: { type: Date, default: Date.now },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("DevOpsTimers", devOpsTimers)
