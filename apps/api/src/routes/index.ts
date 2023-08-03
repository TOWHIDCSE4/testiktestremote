import { Application } from "express"
import { API_ROOT } from "../utils/constants"
import UsersRoute from "./users"
import TimerRoute from "./timers"
import FactoryRoute from "./factories"
import LocationRoute from "./locations"
import MachineClassRoute from "./machineClasses"
import MachineRoute from "./machines"
import PartRoute from "./parts"
import TimerLogRoute from "./timerLogs"
import TimersRoute from "./timers"

export default function (app: Application) {
  app.use(`${API_ROOT}/users`, UsersRoute)
  app.use(`${API_ROOT}/timers`, TimerRoute)
  app.use(`${API_ROOT}/timer-logs`, TimerLogRoute)
  app.use(`${API_ROOT}/parts`, PartRoute)
  app.use(`${API_ROOT}/machines`, MachineRoute)
  app.use(`${API_ROOT}/machine-classes`, MachineClassRoute)
  app.use(`${API_ROOT}/locations`, LocationRoute)
  app.use(`${API_ROOT}/factories`, FactoryRoute)
}
