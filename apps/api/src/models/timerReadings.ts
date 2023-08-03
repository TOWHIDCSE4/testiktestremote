import mongoose from "mongoose"
const { Schema } = mongoose

const timerReadings = new Schema({
  action: String,
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("TimerReading", timerReadings)
