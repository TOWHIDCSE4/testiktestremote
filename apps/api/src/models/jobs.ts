import mongoose from "mongoose"
const { Schema } = mongoose

const jobs = new Schema({
  name: String,
  description: String,
  factoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Factory",
  },
  isActive: Boolean,
  machineId: {
    type: mongoose.Schema.ObjectId,
    ref: "Machine",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("Job", jobs)
