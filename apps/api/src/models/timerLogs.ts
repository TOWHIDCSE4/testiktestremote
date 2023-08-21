import mongoose from "mongoose"
const { Schema } = mongoose

const timerLogs = new Schema({
  cycledId: Number,
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
    default: [
      "Unit Created",
      "Machine Error",
      "Machine Low",
      "Worker Break",
      "Maintenance",
      "Change Part",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("TimerLog", timerLogs)
