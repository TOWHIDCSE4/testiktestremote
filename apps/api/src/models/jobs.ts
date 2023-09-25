import mongoose from "mongoose"
const { Schema } = mongoose

const jobs = new Schema({
  name: String,
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  partId: {
    type: mongoose.Schema.ObjectId,
    ref: "Part",
  },
  machineClassId: {
    type: mongoose.Schema.ObjectId,
    ref: "MachineClass",
  },
  factoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Factory",
  },
  drawingNumber: String,
  count: Number,
  priorityStatus: {
    type: String,
    enum: ["High", "Medium", "Low"],
  },
  status: {
    type: String,
    enum: ["Pending", "Active", "Testing", "Archived", "Deleted"],
  },
  isStock: Boolean,
  dueDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("Job", jobs)
