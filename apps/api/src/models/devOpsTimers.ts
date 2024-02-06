import mongoose from "mongoose"
const { Schema } = mongoose

const devOpsTimers = new Schema({
  machineClassId: {
    type: mongoose.Schema.ObjectId,
    ref: "MachineClass",
  },
  sessionId: {
    type: mongoose.Schema.ObjectId,
    ref: "DevOpsSession",
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
  sessionName: {
    type: String,
    ref: "DevOpsSession",
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
    enum: ["SUCCESS", "FAILURE"],
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
