import mongoose from "mongoose"

const deviceLog = new mongoose.Schema(
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
    note: String,
    type: {
      type: String,
      enum: ["danger", "warning", "info"],
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
)

export default mongoose.model("DeviceLog", deviceLog)
