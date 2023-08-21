import mongoose from "mongoose"
const { Schema } = mongoose

const controllerTimers = new Schema({
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

export default mongoose.model("ControllerTimer", controllerTimers)
