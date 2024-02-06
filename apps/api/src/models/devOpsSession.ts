import mongoose from "mongoose"
const { Schema } = mongoose

const devOpsSession = new Schema({
  name: String,
  duration: Number,
  date: Date,
  endTime: String,
  startTime: Number,
  noOfTimers: Number,
  noOfAlerts: Number,
  locationId: String,
  endTimeRange: Array,
  unitCycleTime: Array,
  machineClassIds: Array,
  activeTimersRange: Array,
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
