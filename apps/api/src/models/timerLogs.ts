import mongoose from "mongoose"
const { Schema } = mongoose

const timerLogs = new Schema({
  cycle: Number,
  globalCycle: Number,
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  factoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Factory",
  },
  partId: {
    type: mongoose.Schema.ObjectId,
    ref: "Part",
  },
  jobId: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
  },
  machineId: {
    type: mongoose.Schema.ObjectId,
    ref: "Machine",
  },
  machineClassId: {
    type: mongoose.Schema.ObjectId,
    ref: "MachineClass",
  },
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
    index: true,
  },
  time: Number,
  operatorName: {
    type: String,
    nullable: true,
  },
  operator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    nullable: true,
  },
  status: {
    type: String,
    enum: ["Gain", "Loss"],
  },
  stopReason: {
    type: [String],
    enum: [
      "Unit Created",
      "Production Ended",
      "Machine Error",
      "Material Low",
      "Machine Cleaning",
      "Personal Injury",
      "Maintenance",
      "Change Part",
    ],
    default: ["Unit Created"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("TimerLog", timerLogs)
