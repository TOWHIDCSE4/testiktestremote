export const REFETCH_ACTIVATED = false

export const INVALID_AUTH = "Invalid authentication"

export const API_URL = process.env.API_URL
export const REFETCH_TIME = 5000
export const SENTRY_WEB_DSN = process.env.SENTRY_WEB_DSN

export const USER_ROLES = {
  Production: "Production",
  Corporate: "Corporate",
  Administrator: "Administrator",
  Personnel: "Personnel",
  HR: "HR",
  Sales: "Sales",
  Accounting: "Accounting",
  Super: "Super",
  HR_Director: "HR_Director",
}

export const USER_STATUSES = {
  Approved: "Approved",
  Rejected: "Rejected",
  Archived: "Archived",
  Blocked: "Blocked",
  Pending: "Pending",
}

export const ONE_DAY = 1000 * 60 * 60 * 24 // 24 hours
export const SIXTEEN_HOURS = 1000 * 60 * 60 * 16 // 16 hours
export const TWELVE_HOURS = 1000 * 60 * 60 * 12 // 12 hours
export const THREE_MINUTES = 1000 * 60 * 3 // 3 minutes
export const FIFTEEN_MINUTES = 1000 * 60 * 15 // 15 minutes
export const TEN_MINUTES = 1000 * 60 * 10 // 10 minutes

export const API_URL_USERS = "/api/users"
export const API_URL_PARTS = "/api/parts"
export const API_URL_FACTORIES = "/api/factories"
export const API_URL_MACHINE_CLASS = "/api/machine-classes"
export const API_URL_LOCATIONS = "/api/locations"
export const API_URL_UPLOAD = "/api/files"
export const API_URL_TIMER = "/api/timers"
export const API_URL_TIMER_LOGS = "/api/timer-logs"
export const API_URL_MACHINE = "/api/machines"
export const API_URL_JOBS = "/api/jobs"
export const API_URL_CONTROLLER_TIMER = "/api/controller-timers"
export const API_URL_CYCLE_TIMER = "/api/cycle-timers"
export const API_URL_JOB_TIMER = "/api/job-timer"
export const API_URL_VERIFIED_PART = "/api/parts/verify"
export const API_URL_VERIFIED_MACHINE = "/api/machines/verify"
export const API_URL_GLOBAL_METRICS = "/api/timer-logs"
export const API_URL_PRODUCTION_LOOKUP = "/api/production-lookup"
export const API_URL_DASHBOARD_CONFIG = "/api/dashboard-config"
export const API_URL_READINGS = "/api/readings"
export const API_URL_EVENTS = "/api/events"
