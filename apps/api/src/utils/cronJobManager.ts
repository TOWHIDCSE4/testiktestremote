import CronJobManager from "cron-job-manager"

const manager = new CronJobManager()

export type T_CronJobTime = {
  h: number
  m: number
  pm: boolean
}

export const generateCronTabExp = (time: T_CronJobTime): string => {
  const mString = time.m
  const hString = time.pm ? time.h + 12 : time.h

  return `${mString} ${hString} * * *`
}

export default manager

export const addCronJob = (
  key: string,
  time: T_CronJobTime,
  func: () => void,
  timezone?: string
) => {
  const exp = generateCronTabExp(time)
  manager.add(key, exp, func, { timezone })
}

export const removeCronJob = (key: string) => {
  if (manager.exists(key)) {
    manager.deleteJob(key)
    return true
  } else {
    throw new Error("No cron job on " + key)
  }
}

export const setCronJob = (
  key: string,
  time: T_CronJobTime,
  func: () => void,
  timezone?: string
) => {
  const exp = generateCronTabExp(time)
  if (manager.exists(key)) {
    manager.update(key, exp, func)
  } else {
    addCronJob(key, time, func, timezone)
  }
}

export const startCronJob = (key: string) => {
  if (manager.exists(key)) {
    manager.start(key)
  } else {
    throw new Error("No cron job on " + key)
  }
}

export const stopCronJob = (key: string) => {
  if (manager.exists(key)) {
    manager.stop(key)
  } else {
    throw new Error("No cron job on " + key)
  }
}

export const getCronJobList = () => {
  return "M"
}
