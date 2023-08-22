import mongoose from "mongoose"
const { Schema } = mongoose

const timerLogs = new Schema({
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
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
  },
  time: Number,
  operator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Gain", "Loss"],
  },
  stopReason: {
    type: [String],
    enum: [
      "Unit Created",
      "Machine Error",
      "Material Low",
      "Worker Break",
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
