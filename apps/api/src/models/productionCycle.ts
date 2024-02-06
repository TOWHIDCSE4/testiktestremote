import mongoose from "mongoose"
const { Schema } = mongoose

const productionCycles = new Schema({
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endAt: {
    type: Date,
    default: null,
  },
})

export default mongoose.model("ProductionCycle", productionCycles)
