import mongoose from "mongoose"
const { Schema } = mongoose

const factories = new Schema({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("Factory", factories)
