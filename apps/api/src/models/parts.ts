import mongoose, { Types } from "mongoose"
const { Schema } = mongoose

const parts = new Schema({
  name: String,
  factoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Factory",
  },
  machineClassId: {
    type: mongoose.Schema.ObjectId,
    ref: "MachineClass",
  },
  files: {
    type: Array,
    default: [],
  },
  tons: Number,
  time: Number,
  finishGoodWeight: Number,
  cageWeightActual: Number,
  cageWeightScrap: Number,
  locationId: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  //TODO:get from logs
  inInventory: {
    type: Number,
    default: 0,
    nullable: true,
  },
  manufactureCost: {
    type: Number,
    default: 0,
    nullable: true,
  },
  topSellPriceL: {
    type: Number,
    default: 0,
    nullable: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
})

export default mongoose.model("Part", parts)
