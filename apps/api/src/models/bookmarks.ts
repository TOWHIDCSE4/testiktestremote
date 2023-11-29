import mongoose from "mongoose"
const { Schema } = mongoose

const bookmarks = new Schema({
  modelName: String,
  modelId: mongoose.Schema.ObjectId,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("Bookmark", bookmarks)
