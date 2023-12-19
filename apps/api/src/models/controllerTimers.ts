import mongoose from "mongoose"
const { Schema } = mongoose

const controllerTimers = new Schema({
  timerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Timer",
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
  endAt: Date,
})

export default mongoose.model("ControllerTimer", controllerTimers)
