import mongoose from "mongoose"
const { Schema } = mongoose

const timerLogs = new Schema({
  partId: {
    type: mongoose.Schema.ObjectId,
    ref: "Part",
  },
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
  },
  time: String,
  operator: String,
  status: String,
  stopReason: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("TimerLog", timerLogs)
