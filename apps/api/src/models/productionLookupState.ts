import mongoose from "mongoose"
const { Schema } = mongoose
const productionLookupState = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  locations: {
    type: Array,
    default: [],
  },
  machineClasses: {
    type: Array,
    default: [],
  },
  machines: {
    type: Array,
    default: [],
  },
  parts: {
    type: Array,
    default: [],
  },
  startDate: {
    type: Date,
    optional: true,
  },
  endDate: {
    type: Date,
    optional: true,
  },
  includeCycles: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})
export default mongoose.model("productionLookupState", productionLookupState)
