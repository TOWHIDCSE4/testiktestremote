import { T_CreateReading, T_ReadingOptional } from "custom-validator"
import ReadingsRepository from "../repository/readingsRepository"

const get = (filter: T_ReadingOptional) => {
  return ReadingsRepository.find(filter, {
    sort: {
      createdAt: 1,
    },
  })
}

const clearReadings = (filter: T_ReadingOptional) => {
  return ReadingsRepository.deleteMany(filter)
}

const create = (newReading: T_CreateReading) => {
  return ReadingsRepository.create(newReading)
}

const ReadingsService = {
  get,
  create,
  clearReadings,
}

export default ReadingsService
