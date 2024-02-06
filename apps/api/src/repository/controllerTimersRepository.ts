import { T_ControllerTimer } from "custom-validator"
import { createBaseRepository } from "./baseRepository"
import ControllerTimers from "../models/controllerTimers"
import { assign } from "lodash/fp"

const ControllerTimerRepository = assign(
  createBaseRepository<
    typeof ControllerTimers,
    T_ControllerTimer,
    T_ControllerTimer
  >(ControllerTimers),
  {}
)

export default ControllerTimerRepository
