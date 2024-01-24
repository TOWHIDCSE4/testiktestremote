export const REFETCH_ACTIVATED = false

export const INVALID_AUTH = "Invalid authentication"

export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
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

export const API_URL_USERS = `${NEXT_PUBLIC_API_URL}/api/users`
export const API_URL_PARTS = `${NEXT_PUBLIC_API_URL}/api/parts`
export const API_URL_FACTORIES = `${NEXT_PUBLIC_API_URL}/api/factories`
export const API_URL_MACHINE_CLASS = `${NEXT_PUBLIC_API_URL}/api/machine-classes`
export const API_URL_LOCATIONS = `${NEXT_PUBLIC_API_URL}/api/locations`
export const API_URL_UPLOAD = `/api/files`
export const API_URL_TIMER = `${NEXT_PUBLIC_API_URL}/api/timers`
export const API_URL_TIMER_LOGS = `${NEXT_PUBLIC_API_URL}/api/timer-logs`
export const API_URL_MACHINE = `${NEXT_PUBLIC_API_URL}/api/machines`
export const API_URL_JOBS = `${NEXT_PUBLIC_API_URL}/api/jobs`
export const API_URL_CONTROLLER_TIMER = `${NEXT_PUBLIC_API_URL}/api/controller-timers`
export const API_URL_CYCLE_TIMER = `${NEXT_PUBLIC_API_URL}/api/cycle-timers`
export const API_URL_JOB_TIMER = `${NEXT_PUBLIC_API_URL}/api/job-timer`
export const API_URL_VERIFIED_PART = `${NEXT_PUBLIC_API_URL}/api/parts/verify`
export const API_URL_VERIFIED_MACHINE = `${NEXT_PUBLIC_API_URL}/api/machines/verify`
export const API_URL_GLOBAL_METRICS = `${NEXT_PUBLIC_API_URL}/api/timer-logs`
export const API_URL_PRODUCTION_LOOKUP = `${NEXT_PUBLIC_API_URL}/api/production-lookup`
export const API_URL_DASHBOARD_CONFIG = `${NEXT_PUBLIC_API_URL}/api/dashboard-config`
export const API_URL_READINGS = `${NEXT_PUBLIC_API_URL}/api/readings`
export const API_URL_EVENTS = `${NEXT_PUBLIC_API_URL}/api/events`
export const API_URL = `${NEXT_PUBLIC_API_URL}`
export const API_URL_REPORTS = `${NEXT_PUBLIC_API_URL}/api/reports`
export const API_URL_TIMERS_MACHINECLASS = `${NEXT_PUBLIC_API_URL}/api/timers/find/group/machine-class`
export const API_URL_TIMERS_TONSUNIT = `${NEXT_PUBLIC_API_URL}/api/timers/timer-tons-unit`
export const API_URL_ALL_LOCATIONS_TOTAL_TONSUNIT = `${NEXT_PUBLIC_API_URL}/api/timers/all-global-tons-unit`
export const API_URL_AUTOTIMER = `${NEXT_PUBLIC_API_URL}/api/auto-timer`