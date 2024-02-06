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
import JobTimerRoute from "./jobTimer"
import JobRoute from "./jobs"
import CycleTimerRoute from "./cycleTimers"
import ControllerTimerRoute from "./controllerTimers"
import ProfileLookupRoute from "./productionLookupState"
import dashboardConfigRoute from "./dashboardConfig"
import readingsRoute from "./readings"
import reportsRoute from "./reports"
import devOpsRoute from "./dev-ops"
import autoTimerRoute from "./autoTimer"
import deviceRouter from "./device"

const App = (app: Application) => {
  app.use(`${API_ROOT}/users`, UsersRoute)
  app.use(`${API_ROOT}/timers`, TimerRoute)
  app.use(`${API_ROOT}/job-timer`, JobTimerRoute)
  app.use(`${API_ROOT}/timer-logs`, TimerLogRoute)
  app.use(`${API_ROOT}/parts`, PartRoute)
  app.use(`${API_ROOT}/machines`, MachineRoute)
  app.use(`${API_ROOT}/machine-classes`, MachineClassRoute)
  app.use(`${API_ROOT}/locations`, LocationRoute)
  app.use(`${API_ROOT}/factories`, FactoryRoute)
  app.use(`${API_ROOT}/jobs`, JobRoute)
  app.use(`${API_ROOT}/cycle-timers`, CycleTimerRoute)
  app.use(`${API_ROOT}/controller-timers`, ControllerTimerRoute)
  app.use(`${API_ROOT}/production-lookup`, ProfileLookupRoute)
  app.use(`${API_ROOT}/dashboard-config`, dashboardConfigRoute)
  app.use(`${API_ROOT}/readings`, readingsRoute)
  app.use(`${API_ROOT}/reports`, reportsRoute)
  app.use(`${API_ROOT}/dev-ops`, devOpsRoute)
  app.use(`${API_ROOT}/auto-timer`, autoTimerRoute)
  app.use(`${API_ROOT}/device`, deviceRouter)
}

export default App
