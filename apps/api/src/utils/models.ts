import mongoose, { Model } from "mongoose"

export async function getModel<T extends mongoose.Document>(
  modelName: string
): Promise<Model<T>> {
  const Model = await import(`../models/${modelName}`)
  return Model.default
}
