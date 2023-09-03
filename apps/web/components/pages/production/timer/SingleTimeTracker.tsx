"use client"
import { T_Timer } from "custom-validator"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import useTimersByLocation from "../../../../hooks/timers/useTimersByLocation"
import Table from "./TimerTracker/Table"
import useGetCycleTimerRealTime from "../../../../hooks/timers/useGetCycleTimerRealTime"
import { hourMinuteSecond } from "../../../../helpers/timeConverter"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import useGetTimerDetails from "../../../../hooks/timers/useGetTimerDetails"

const SingleTimeTracker = ({ timerId }: { timerId: string }) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const [dailyUnits, setDailyUnits] = useState<number>(0)
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId as string)
  const [selectedTimerMachine, setSelectedTimerMachine] = useState<string>("")
  const [selectedLocationId, setSelectedLocationId] = useState<string>("")
  const { data: cycleTimer, isLoading: isCycleTimerLoading } =
    useGetCycleTimerRealTime(timerId as string)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [cycleClockInSeconds, setCycleClockInSeconds] = useState(0)
  const [cycleClockTimeArray, setCycleCockTimeArray] = useState<
    Array<number | string>
  >([])
  const [cycleClockIntervalId, setCycleClockIntervalId] = useState<number>(0)

  useEffect(() => {
    if (timerDetailData?.item) {
      setSelectedTimerMachine(timerDetailData?.item?.machineId?.name as string)
      setSelectedLocationId(timerDetailData?.item?.locationId?._id as string)
    }
  }, [timerDetailData])
  const runCycle = () => {
    const interval: any = setInterval(() => {
      setCycleClockInSeconds((previousState: number) => previousState + 1)
    }, 1000)
    setCycleClockIntervalId(interval)
  }
  useEffect(() => {
    setCycleCockTimeArray(hourMinuteSecond(cycleClockInSeconds))
  }, [cycleClockInSeconds])
  useEffect(() => {
    if (
      timerDetailData?.item &&
      cycleTimer?.items &&
      cycleTimer?.items.length > 0
    ) {
      const timeZone = timerDetailData?.item?.locationId?.timeZone
      const timerStart = dayjs.tz(
        dayjs(cycleTimer?.items[0].createdAt),
        timeZone ? timeZone : ""
      )
      const currentDate = dayjs.tz(dayjs(), timeZone ? timeZone : "")
      const secondsLapse = currentDate.diff(timerStart, "seconds", true)
      setCycleClockInSeconds(secondsLapse)
      if (!cycleTimer?.items[0].endAt && !isCycleClockRunning) {
        runCycle()
        setIsCycleClockRunning(true)
      }
    } else {
      clearInterval(cycleClockIntervalId)
      setIsCycleClockRunning(false)
    }
  }, [cycleTimer, timerDetailData])

  return (
    <div
      className={`drop-shadow-lg border border-gray-200 bg-white rounded-md mt-0 h-screen`}
    >
      <div>
        <div>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-4 py-2">
            <div className="flex-1 flex gap-3 items-center">
              <h3 className="text-lg">Daily Units:</h3>
              <h3 className="text-lg font-bold">{dailyUnits}</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold">{selectedTimerMachine}</h3>
              <h3 className="text-lg text-gray-400">
                {timerDetailData?.item?.locationId.name}
              </h3>
            </div>
            <div className="flex-1 flex gap-3 items-center justify-end">
              {isCycleClockRunning ? (
                <div className="flex items-center justify-center">
                  <h2
                    className={`text-center font-bold text-3xl ${
                      !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                    }`}
                  >
                    {cycleClockTimeArray[0]}
                  </h2>
                  <span
                    className={`text-center font-bold text-3xl ${
                      !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                    }`}
                  >
                    :
                  </span>
                  <h2
                    className={`text-center font-bold text-3xl ${
                      !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                    }`}
                  >
                    {cycleClockTimeArray[1]}
                  </h2>
                  <span
                    className={`text-center font-bold text-3xl ${
                      !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                    }`}
                  >
                    :
                  </span>
                  <h2
                    className={`text-center font-bold text-3xl ${
                      !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                    }`}
                  >
                    {cycleClockTimeArray[2]}
                  </h2>
                </div>
              ) : (
                <h2 className="font-bold text-stone-400 text-3xl">00:00:00</h2>
              )}
            </div>
          </div>
          {/* Table */}
          <Table
            timerId={timerId}
            locationId={selectedLocationId}
            timerMachine={selectedTimerMachine}
            setDailyUnits={setDailyUnits}
          />
        </div>
      </div>
    </div>
  )
}
export default SingleTimeTracker
