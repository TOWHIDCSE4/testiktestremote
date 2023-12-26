import { T_CreateReading, T_ReadingOptional } from "custom-validator"
import ReadingsRepository from "../repository/readingsRepository"

const get = (filter: T_ReadingOptional) => {
  return ReadingsRepository.find(filter)
}

const create = (newReading: T_CreateReading) => {
  return ReadingsRepository.create(newReading)
}

const ReadingsService = {
  get,
  create,
}

export default ReadingsService
