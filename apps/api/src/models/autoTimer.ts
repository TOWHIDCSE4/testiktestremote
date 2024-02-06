import mongoose, { Schema } from "mongoose"

const autoTimer = new Schema(
  {
    locationId: {
      type: Schema.ObjectId,
      ref: "Location",
    },
    machineClassId: {
      type: Schema.ObjectId,
      ref: "MachineClass",
    },
    timeM: {
      type: Number,
      default: 0,
    },
    timeH: {
      type: Number,
      default: 0,
    },
    isPM: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
)

export default mongoose.model("AutoTimer", autoTimer)
