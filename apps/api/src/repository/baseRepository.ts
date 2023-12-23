import { FilterQuery, Model } from "mongoose"
import { merge } from "lodash/fp"

interface QueryOption {
  sort: Record<string, any>
  limit?: number
  offset?: number
}

const DefaultOption = {}

export const createBaseRepository = <
  T extends Model<any>,
  Data = {},
  CreateParam = Data
>(
  model: T
) => {
  const create = async (param: CreateParam): Promise<Data> => {
    const newData = new model(param)
    await newData.save()
    return newData.toObject()
  }

  const find = async (
    filter: FilterQuery<Data>,
    option: Partial<QueryOption> = DefaultOption
  ): Promise<Data[]> => {
    const { sort, limit, offset } = merge(option, DefaultOption)
    const result = model.find(filter)
    if (sort) {
      console.log("penisirin", sort)
      result.sort(sort)
    }
    if (limit) {
      result.limit(limit)
    }
    if (offset) {
      result.skip(offset)
    }
    return await result.exec()
  }

  const getPage = async (
    page: number,
    perPage: number,
    filter: FilterQuery<Data>,
    option: Partial<QueryOption> = DefaultOption
  ) => {
    return find(filter, {
      ...option,
      limit: perPage,
      offset: (page - 1) * perPage,
    })
  }

  const findOne = async (
    filter: FilterQuery<Data>,
    option: Partial<QueryOption> = DefaultOption
  ): Promise<Data | null> => {
    const { sort } = merge(option, DefaultOption)

    const result = await model.findOne(filter).sort(sort)
    return result
  }

  const updateMany = async (
    filter: FilterQuery<Data>,
    newData: Partial<Data>,
    option: Partial<QueryOption> = DefaultOption
  ): Promise<Data[]> => {
    await model.updateMany(filter, newData, { new: true })

    return find(filter, option)
  }

  const updateOne = async (
    filter: FilterQuery<Data>,
    newData: Partial<Data>
  ) => {
    return model.findOneAndUpdate(filter, newData, { new: true })
  }

  return {
    create,
    find,
    findOne,
    updateMany,
    updateOne,
    getPage,
  }
}
