import { useState, useRef } from "react"

const useTimer = (initialState = 0) => {
  const [elapsedTime, setElapsedTime] = useState(initialState)
  const [isRunning, setIsRunning] = useState(false)
  const countRef = useRef(null)

  const handleStart = () => {
    const startTime = Date.now() - elapsedTime
    // @ts-ignore
    countRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 10)
    setIsRunning(true)
  }

  const handlePause = () => {
    // @ts-ignore
    clearInterval(countRef.current)
    setIsRunning(false)
  }

  const handleReset = () => {
    // @ts-ignore
    clearInterval(countRef.current)
    setIsRunning(false)
    setElapsedTime(0)
  }

  return { elapsedTime, isRunning, handleStart, handlePause, handleReset }
}

export default useTimer
