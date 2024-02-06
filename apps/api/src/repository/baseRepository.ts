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
  Data = any,
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

    return find(filter, merge(option, DefaultOption))
  }

  const updateOne = async (
    filter: FilterQuery<Data>,
    newData: Partial<Data>
  ) => {
    return model.findOneAndUpdate(filter, newData, { new: true })
  }

  const deleteMany = async (
    filter: FilterQuery<Data>,
    option: Partial<QueryOption> = DefaultOption
  ) => {
    const mergedOption = merge(option, DefaultOption)
    return model.deleteMany(filter).sort(mergedOption.sort)
  }

  const deleteOne = async (
    filter: FilterQuery<Data>,
    option: Partial<QueryOption> = DefaultOption
  ) => {
    const mergedOption = merge(option, DefaultOption)
    return model.deleteOne(filter).sort(mergedOption.sort)
  }

  return {
    create,
    find,
    findOne,
    updateMany,
    updateOne,
    getPage,
    deleteMany,
    deleteOne,
  }
}
