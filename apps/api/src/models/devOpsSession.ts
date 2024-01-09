import mongoose from "mongoose"
const { Schema } = mongoose

const devOpsSession = new Schema({
  name: String,
  duration: Number,
  date: Date,
  endTime: String,
  noOfTimers: Number,
  noOfAlerts: Number,
  locationId: String,
  startTime: Number,
  endTimeRange: Array,
  unitCycleTime: Array,
  machineClassIds: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  timers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "DevOpsTimers",
    },
  ],
})

export default mongoose.model("DevOpsSession", devOpsSession)
