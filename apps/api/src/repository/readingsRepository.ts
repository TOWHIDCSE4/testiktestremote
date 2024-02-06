import { createBaseRepository } from "./baseRepository"
import readings from "../models/readings"
import { T_CreateReading, T_Reading } from "custom-validator"

const ReadingsRepository = {
  ...createBaseRepository<typeof readings, T_Reading, T_CreateReading>(
    readings
  ),
}

export default ReadingsRepository
