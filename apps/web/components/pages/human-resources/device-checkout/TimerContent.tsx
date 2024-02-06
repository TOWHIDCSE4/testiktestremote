import { useCallback, useMemo } from "react"

const getTime = (t = 0) => {
  let temp = t
  const hour = Math.floor(temp / 3600)
  temp -= 3600 * hour
  const minute = Math.floor(temp / 60)
  temp -= 60 * minute
  const second = temp
  return { hour, minute, second }
}

export const TimeText = ({ time = 0 }) => {
  const { hour, minute, second } = useMemo(() => getTime(time), [time])

  const normalizeDigit = useCallback((digit: number) => {
    return (
      <>
        {digit < 10 && <span>0</span>}
        {digit > 0 && <span className="text-gold">{digit}</span>}
        {digit == 0 && <span>0</span>}
      </>
    )
  }, [])

  const hElem = useMemo(() => normalizeDigit(hour), [hour])
  const mElem = useMemo(() => normalizeDigit(minute), [minute])
  const sElem = useMemo(() => normalizeDigit(second), [second])

  return (
    <div className="flex items-center">
      {hElem}
      {hElem && <span>:</span>}
      {mElem}
      {mElem && <span>:</span>}
      {sElem}
    </div>
  )
}

export const DateText = ({ date = 0 }) => {
  const normalizeDigit = useCallback((digit: number) => {
    return (
      <>
        {digit < 1000 && <span className="text-disabled">0</span>}
        {digit < 100 && <span className="text-disabled">0</span>}
        {digit < 10 && <span className="text-disabled">0</span>}
        {digit > 0 && <span>{digit}</span>}
        {digit == 0 && <span className="text-disabled">0</span>}
      </>
    )
  }, [])

  const dateElem = useMemo(() => normalizeDigit(date), [date])

  return (
    <>
      <span className="font-bold">{dateElem}</span>
      <span className="mr-2">D</span>
    </>
  )
}

export const DateTimeText = ({ date = 0, time = 0 }) => {
  return (
    <div className="flex items-center">
      <DateText date={date} />
      <TimeText time={time} />
    </div>
  )
}

export const TimeDiffText = ({
  now,
  entry,
}: {
  now: number
  entry: number
}) => {
  const original = useMemo(() => {
    if (!entry) return 0
    try {
      const date = new Date(entry)
      if (isNaN(date.getTime())) return 0
      return date.getTime()
    } catch {
      return 0
    }
  }, [entry])
  const diff = useMemo(() => now - original, [now, original])
  const date = useMemo(
    () => (diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0),
    [diff]
  )
  const time = useMemo(
    () =>
      diff > 0 ? Math.floor((diff - date * 1000 * 60 * 60 * 24) / 1000) : 0,
    [diff, date]
  )
  return <DateTimeText date={date} time={time} />
}
