import { T_CycleTimer } from "custom-validator"
import { createBaseRepository } from "./baseRepository"
import cycleTimers from "../models/cycleTimers"

const CycleTimerRepository = {
  ...createBaseRepository<typeof cycleTimers, T_CycleTimer, T_CycleTimer>(
    cycleTimers
  ),
}

export default CycleTimerRepository
