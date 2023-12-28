import mongoose from "mongoose"
const { Schema } = mongoose

const controllerTimers = new Schema({
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
    index: true,
  },
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clientStartedAt: {
    type: Date,
  },
  additionalTime: {
    type: Number,
  },
  endAt: {
    type: Date,
    default: null,
  },
})

export default mongoose.model("ControllerTimer", controllerTimers)
