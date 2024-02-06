import mongoose from "mongoose"
const { Schema } = mongoose

const jobTimer = new Schema({
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
  },
  jobId: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("JobTimer", jobTimer)
