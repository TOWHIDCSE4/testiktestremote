import mongoose from "mongoose"
const { Schema } = mongoose

// Define the schema
const deviceTypeSchema = new Schema(
  {
    name: String,
    image: String,
    deletedAt: Date,
    order: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
)

// Register the model
const DeviceType = mongoose.model("DevType", deviceTypeSchema, "device_types")

export default DeviceType
