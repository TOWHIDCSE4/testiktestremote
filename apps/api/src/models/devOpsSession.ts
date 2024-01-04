import mongoose from "mongoose"
const { Schema } = mongoose

const devOpsSession = new Schema({
  name: String,
  duration: Number,
  date: Date,
  endTime: String,
  noOfTimers: Number,
  noOfAlerts: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("DevOpsSession", devOpsSession)
