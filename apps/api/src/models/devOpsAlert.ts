import mongoose from "mongoose"
const { Schema } = mongoose

const devOpsAlert = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['info', 'success', 'warning', "error"],
    default: 'info',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("DevOpsAlert", devOpsAlert)
