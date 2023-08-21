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
import TimerReadingsRoute from "./timerReadings"
import JobRoute from "./jobs"
import CycleTimerRoute from "./cycleTimers"

const App = (app: Application) => {
  app.use(`${API_ROOT}/users`, UsersRoute)
  app.use(`${API_ROOT}/timers`, TimerRoute)
  app.use(`${API_ROOT}/timer-readings`, TimerReadingsRoute)
  app.use(`${API_ROOT}/timer-logs`, TimerLogRoute)
  app.use(`${API_ROOT}/parts`, PartRoute)
  app.use(`${API_ROOT}/machines`, MachineRoute)
  app.use(`${API_ROOT}/machine-classes`, MachineClassRoute)
  app.use(`${API_ROOT}/locations`, LocationRoute)
  app.use(`${API_ROOT}/factories`, FactoryRoute)
  app.use(`${API_ROOT}/jobs`, JobRoute)
  app.use(`${API_ROOT}/cycle-timers`, CycleTimerRoute)
}

export default App
