export function hourMinuteSecond(timeInSeconds: number): (number | string)[] {
  let hours: number = Math.floor(timeInSeconds / 3600)
  let minutes: number = Math.floor((timeInSeconds - hours * 3600) / 60)
  let seconds: number = Math.trunc(timeInSeconds - hours * 3600 - minutes * 60)

  return [
    hours < 10 ? `0${hours}` : hours,
    minutes < 10 ? `0${minutes}` : minutes,
    seconds < 10 ? `0${seconds}` : seconds,
  ]
}

export function hourMinuteSecondMilli(
  timeInSeconds: number
): (number | string)[] {
  let hours: number = Math.floor(timeInSeconds / 3600)
  let minutes: number = Math.floor((timeInSeconds - hours * 3600) / 60)
  let seconds: number = Math.trunc(timeInSeconds - hours * 3600 - minutes * 60)
  let milliseconds: string = (
    timeInSeconds -
    hours * 3600 -
    minutes * 60
  ).toFixed(2)
  let millisecondsOnly = milliseconds.split(".")

  return [
    hours < 10 ? `0${hours}` : hours,
    minutes < 10 ? `0${minutes}` : minutes,
    seconds < 10 ? `0${seconds}` : seconds,
    Number(millisecondsOnly[1]) < 10
      ? `${millisecondsOnly[1]}`
      : millisecondsOnly[1],
  ]
}
