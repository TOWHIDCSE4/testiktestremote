import mongoose from "mongoose"
const { Schema } = mongoose

const cycleTimers = new Schema({
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clientStartedAt: {
    type: Date,
  },
  sessionId: {
    type: String,
  },
  endAt: {
    type: Date,
    default: null,
  },
})

export default mongoose.model("CycleTimer", cycleTimers)
