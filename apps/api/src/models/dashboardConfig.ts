import mongoose, { Schema, mongo } from "mongoose"

const dashboardConfig = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    unique: true,
  },
  systemLookup: {
    type: Boolean,
  },
})
export default mongoose.model("DashboardConfig", dashboardConfig)
