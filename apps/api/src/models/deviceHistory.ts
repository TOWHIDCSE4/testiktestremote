import mongoose from "mongoose"

const deviceHistory = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Device",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    locationId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Location",
    },
    note: String,
    startAt: Date,
    endAt: Date,
    active: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected", "ended"],
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
)

export default mongoose.model("DeviceHistory", deviceHistory)
