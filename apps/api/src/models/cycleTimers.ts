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
  endAt: Date,
})

export default mongoose.model("CycleTimer", cycleTimers)
