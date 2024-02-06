import mongoose from "mongoose"
const { Schema } = mongoose

const machineClasses = new Schema({
  name: String,
  rowNumber: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  order: Number,
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("MachineClass", machineClasses)
