import { Schema, model } from "mongoose"

const readings = new Schema({
  timerId: {
    type: Schema.ObjectId,
    ref: "Timer",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "2d",
  },
  message: String,
})

export default model("Reading", readings)
