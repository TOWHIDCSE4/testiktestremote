export function hourMinuteSecond(timeInSeconds: number): (number | string)[] {
  const hours: number = Math.floor(timeInSeconds / 3600)
  const minutes: number = Math.floor((timeInSeconds - hours * 3600) / 60)
  const seconds: number = Math.trunc(
    timeInSeconds - hours * 3600 - minutes * 60
  )

  return [
    hours < 10 ? `0${hours}` : hours,
    minutes < 10 ? `0${minutes}` : minutes,
    seconds < 10 ? `0${seconds}` : seconds,
  ]
}

export function hourMinuteSecondMilli(
  timeInSeconds: number
): (number | string)[] {
  const hours: number = Math.floor(timeInSeconds / 3600)
  const minutes: number = Math.floor((timeInSeconds - hours * 3600) / 60)
  const seconds: number = Math.trunc(
    timeInSeconds - hours * 3600 - minutes * 60
  )
  const milliseconds: string = (
    timeInSeconds -
    hours * 3600 -
    minutes * 60
  ).toFixed(2)
  const millisecondsOnly = milliseconds.split(".")

  return [
    hours < 0 ? "00" : hours < 10 ? `0${hours}` : hours,
    hours < 0 ? "00" : minutes < 10 ? `0${minutes}` : minutes,
    hours < 0 ? "00" : seconds < 10 ? `0${seconds}` : seconds,
    Number(millisecondsOnly[1]) < 10
      ? `${millisecondsOnly[1]}`
      : millisecondsOnly[1],
  ]
}

export function hourMinuteSecondInNumber(timeInSeconds: number): number[] {
  const hours: number = Math.floor(timeInSeconds / 3600)
  const minutes: number = Math.floor((timeInSeconds - hours * 3600) / 60)
  const seconds: number = Math.trunc(
    timeInSeconds - hours * 3600 - minutes * 60
  )
  const milliseconds: number = Math.floor(
    (timeInSeconds - hours * 3600 - minutes * 60 - seconds) * 100
  )

  return [hours, minutes, seconds, milliseconds]
}
