import mongoose from "mongoose"
const { Schema } = mongoose

const device = new Schema(
  {
    name: String,
    sn: String,
    typeId: { type: mongoose.Schema.ObjectId, ref: "DevType" },
    status: {
      type: String,
      enum: ["idle", "using", "disabled", "lost", "broken"],
    },
    locationId: { type: mongoose.Schema.ObjectId, ref: "Location" },
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    lastUserId: { type: mongoose.Schema.ObjectId, ref: "User" },
    history: { type: mongoose.Schema.ObjectId, ref: "DeviceHistory" },
    lastUpdatedAt: { type: Date, required: false },
    note: String,
    addedAt: Date,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
)

export default mongoose.model("Device", device)
