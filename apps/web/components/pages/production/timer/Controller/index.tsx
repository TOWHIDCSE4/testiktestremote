"use client"
import { useState, useEffect, useRef } from "react"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import CycleClock from "./CycleClock"
import {
  hourMinuteSecond,
  hourMinuteSecondMilli,
} from "../../../../../helpers/timeConverter"
import getPercentage from "../../../../../helpers/getPercentage"
import EndProductionModal from "../modals/EndProductionModal"
import Header from "./Header"
import Details from "./Details"
import Results from "./Results"
import Footer from "./Footer"
import BottomMenu from "./BottomMenu"
import SideMenu from "./SideMenu"
import useGetControllerTimer from "../../../../../hooks/timers/useGetControllerTimer"
import useAddCycleTimer from "../../../../../hooks/timers/useAddCycleTimer"
import useEndAddCycleTimer from "../../../../../hooks/timers/useEndAddCycleTimer"
import { T_BackendResponse, T_TimerStopReason } from "custom-validator"
import toast from "react-hot-toast"
import useGetCycleTimer from "../../../../../hooks/timers/useGetCycleTimer"
import useEndCycleTimer from "../../../../../hooks/timers/useEndCycleTimer"
import useAddTimerLog from "../../../../../hooks/timerLogs/useAddTimerLog"
import useAddControllerTimer from "../../../../../hooks/timers/useAddControllerTimer"
import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"

const Controller = ({ timerId }: { timerId: string }) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const { data: controllerTimer, isLoading: isControllerTimerLoading } =
    useGetControllerTimer(timerId)
  const { data: cycleTimer, isLoading: isCycleTimerLoading } =
    useGetCycleTimer(timerId)

  const { mutate: addControllerTimer, isLoading: isAddControllerTimerLoading } =
    useAddControllerTimer()
  const { mutate: addCycleTimer, isLoading: isAddCycleTimerLoading } =
    useAddCycleTimer()
  const { mutate: endAddCycleTimer, isLoading: isEndAddCycleTimerLoading } =
    useEndAddCycleTimer()
  const { mutate: endCycleTimer, isLoading: isEndCycleTimerLoading } =
    useEndCycleTimer()

  const { mutate: addTimerLogs, isLoading: isAddTimerLogsLoading } =
    useAddTimerLog()

  const { data: timerLogs, isLoading: isTimerLogsLoading } = useGetAllTimerLogs(
    { locationId: timerDetailData?.item?.locationId._id, timerId }
  )

  const sectionDiv = useRef<HTMLDivElement>(null)

  const [isTimerControllerEnded, setIsTimerControllerEnded] = useState(false)
  const [stopMenu, setStopMenu] = useState(false)
  const [endMenu, setEndMenu] = useState(false)
  const [progress, setProgress] = useState(0)
  const [unitsCreated, setUnitsCreated] = useState(0)
  const [totals, setTotals] = useState({
    unitsPerHour: 0,
    tonsPerHour: 0,
    totalTons: 0,
  })

  const [isTimerClockRunning, setIsTimerClockRunning] = useState(false)
  const [timerClockInSeconds, setTimerClockInSeconds] = useState(0)
  const [timerClockTimeArray, setTimerClockTimeArray] = useState<
    Array<number | string>
  >([])
  const [timerClockIntervalId, setTimerClockIntervalId] = useState<number>(0)

  const [isEndProductionModalOpen, setIsEndProductionModalOpen] =
    useState(false)
  const [isCycleClockStarting, setIsCycleClockStarting] = useState(false)
  const [isCycleClockStopping, setIsCycleClockStopping] = useState(false)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [cycleClockInSeconds, setCycleClockInSeconds] = useState(0)
  const [cycleClockTimeArray, setCycleCockTimeArray] = useState<
    Array<number | string>
  >([])
  const [cycleClockIntervalId, setCycleClockIntervalId] = useState<number>(0)

  const [readingMessages, setReadingMessages] = useState<string[]>([])

  const [stopReasons, setStopReasons] = useState<T_TimerStopReason[]>([])

  const currentDate = dayjs
    .tz(
      dayjs(),
      timerDetailData?.item?.locationId.timeZone
        ? timerDetailData?.item?.locationId.timeZone
        : ""
    )
    .format("YYYY-MM-DD HH:mm:ss")

  useEffect(() => {
    if (cycleClockInSeconds > 0 && progress < 101) {
      const percent = getPercentage(
        cycleClockInSeconds,
        timerDetailData?.item?.partId.time as number
      )
      setProgress(percent)
    }
  }, [cycleClockInSeconds])

  const startingTimerReadings = (messages: string[]) => {
    setTimeout(function () {
      setReadingMessages((previousState) => [...previousState, ...messages])
    }, 1500)
  }

  // Timer Clock

  useEffect(() => {
    setTimerClockTimeArray(hourMinuteSecond(timerClockInSeconds))
  }, [timerClockInSeconds])

  const runTimer = () => {
    const interval: any = setInterval(() => {
      setTimerClockInSeconds((previousState: number) => previousState + 1)
    }, 1000)
    setTimerClockIntervalId(interval)
    setIsTimerClockRunning(true)
  }
  const stopTimer = () => {
    startingTimerReadings([
      `${currentDate} - Ending timer production`,
      `${currentDate} - Timer stopped`,
      `${currentDate} - Timer production ended`,
    ])
    setTimeout(function () {
      setEndMenu(false)
      clearInterval(timerClockIntervalId)
      clearInterval(cycleClockIntervalId)
      setCycleClockInSeconds(0)
      setIsCycleClockRunning(false)
      setIsTimerClockRunning(false)
      setProgress(0)
      setIsTimerControllerEnded(true)
    }, 3000)
  }

  // Cycle Clock

  const callBackReq = {
    onSuccess: (returnData: T_BackendResponse) => {
      if (!returnData.error) {
      } else {
        toast.error(String(returnData.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  useEffect(() => {
    setCycleCockTimeArray(hourMinuteSecondMilli(cycleClockInSeconds))
  }, [cycleClockInSeconds])

  const runCycle = (fromDb?: boolean) => {
    if (timerDetailData?.item?.operator) {
      if (timerDetailData?.item?.jobId) {
        if (!isTimerControllerEnded) {
          setIsCycleClockStarting(true)
          startingTimerReadings([
            `${currentDate} - Starting timer`,
            `${currentDate} - Timer started`,
          ])
          setTimeout(function () {
            if (!isCycleClockRunning && !fromDb) {
              addCycleTimer({ timerId }, callBackReq)
            }
            const interval: any = setInterval(() => {
              setCycleClockInSeconds(
                (previousState: number) => previousState + 0.01
              )
            }, 10)
            setCycleClockIntervalId(interval)
            setIsCycleClockRunning(true)
            if (!isTimerClockRunning && !fromDb) {
              addControllerTimer(
                { timerId, locationId: timerDetailData?.item?.locationId._id },
                callBackReq
              )
              runTimer()
            }
            setIsCycleClockStarting(false)
          }, 3000)
        } else {
          toast.error("You already ended this timer")
        }
      } else {
        toast.error("You need to assigned a job to this timer first")
      }
    } else {
      toast.error("You need to assigned an operator to this timer first")
    }
  }

  const stopCycle = () => {
    setIsCycleClockStopping(true)
    startingTimerReadings([
      `${currentDate} - Stopping timer`,
      `${currentDate} - Timer stopped`,
      `${currentDate} - Timer cycle reset`,
      `${currentDate} - One unit created`,
    ])
    setTimeout(function () {
      if (stopReasons.length === 0) {
        endAddCycleTimer(timerId, callBackReq)
        addTimerLogs(
          {
            timerId,
            machineId: timerDetailData?.item?.machineId._id as string,
            jobId: timerDetailData?.item?.jobId as string,
            partId: timerDetailData?.item?.partId._id as string,
            time: cycleClockInSeconds,
            operator: timerDetailData?.item?.operator as string,
            status:
              (timerDetailData?.item?.partId.time as number) >
              cycleClockInSeconds
                ? "Gain"
                : "Loss",
            stopReason: ["Unit Created"],
            cycle: unitsCreated + 1,
          },
          callBackReq
        )
      } else {
        clearInterval(cycleClockIntervalId)
        setIsCycleClockRunning(false)
        setStopReasons([])
        setStopMenu(false)
        endCycleTimer(timerId, callBackReq)
        addTimerLogs(
          {
            timerId,
            machineId: timerDetailData?.item?.machineId._id as string,
            jobId: timerDetailData?.item?.jobId as string,
            partId: timerDetailData?.item?.partId._id as string,
            time: cycleClockInSeconds,
            operator: timerDetailData?.item?.operator as string,
            status:
              (timerDetailData?.item?.partId.time as number) >
              cycleClockInSeconds
                ? "Gain"
                : "Loss",
            stopReason: stopReasons,
            cycle: unitsCreated + 1,
          },
          callBackReq
        )
      }
      setCycleClockInSeconds(0)
      setIsCycleClockStopping(false)
      setUnitsCreated(unitsCreated + 1)
      setProgress(0)
    }, 3000)
  }

  useEffect(() => {
    sectionDiv.current?.scrollIntoView({ behavior: "smooth" })
  }, [readingMessages])

  useEffect(() => {
    if (controllerTimer?.items && controllerTimer?.items.length > 0) {
      const timeZone = timerDetailData?.item?.locationId.timeZone
      const timerStart = dayjs.tz(
        dayjs(controllerTimer?.items[0].createdAt),
        timeZone ? timeZone : ""
      )
      const currentDate = dayjs.tz(
        controllerTimer?.items[0].endAt
          ? dayjs(controllerTimer?.items[0].endAt)
          : dayjs(),
        timeZone ? timeZone : ""
      )
      const secondsLapse = currentDate.diff(timerStart, "seconds", true)
      setTimerClockInSeconds(secondsLapse)
      if (!controllerTimer?.items[0].endAt) {
        runTimer()
      } else {
        setIsTimerControllerEnded(true)
      }
    }
  }, [controllerTimer])

  useEffect(() => {
    if (cycleTimer?.items && cycleTimer?.items.length > 0) {
      const timeZone = timerDetailData?.item?.locationId.timeZone
      const timerStart = dayjs.tz(
        dayjs(cycleTimer?.items[0].createdAt),
        timeZone ? timeZone : ""
      )
      const currentDate = dayjs.tz(dayjs(), timeZone ? timeZone : "")
      const secondsLapse = currentDate.diff(timerStart, "seconds", true)
      setCycleClockInSeconds(secondsLapse)
      if (!cycleTimer?.items[0].endAt) {
        setProgress(secondsLapse)
        runCycle(true)
      }
    }
  }, [cycleTimer])

  useEffect(() => {
    if (timerLogs?.items && timerLogs?.items?.length > 0) {
      setUnitsCreated(timerLogs.itemCount as number)
    }
  }, [timerLogs])

  useEffect(() => {
    if (
      timerDetailData?.item &&
      timerLogs?.itemCount &&
      timerLogs?.items?.length > 0 &&
      timerClockInSeconds > 0
    ) {
      const hoursLapse =
        timerClockInSeconds > 3600 ? timerClockInSeconds / 3600 : 1
      setTotals({
        unitsPerHour: timerLogs?.itemCount / hoursLapse,
        tonsPerHour:
          (timerLogs?.itemCount *
            (timerDetailData?.item?.partId.pounds as number)) /
          hoursLapse,
        totalTons:
          timerLogs?.itemCount *
          (timerDetailData?.item?.partId.pounds as number),
      })
    }
  }, [timerLogs, timerDetailData])

  useEffect(() => {
    if (timerDetailData?.item && timerClockInSeconds > 0) {
      const hoursLapse =
        timerClockInSeconds > 3600 ? timerClockInSeconds / 3600 : 1
      setTotals({
        unitsPerHour: unitsCreated / Math.round(hoursLapse),
        tonsPerHour:
          (unitsCreated * (timerDetailData?.item?.partId.pounds as number)) /
          Math.round(hoursLapse),
        totalTons:
          unitsCreated * (timerDetailData?.item?.partId.pounds as number),
      })
    }
  }, [timerDetailData, unitsCreated])

  return (
    <div className="h-screen overflow-hidden">
      <Header
        progress={progress}
        isLoading={isTimerDetailDataLoading}
        location={timerDetailData?.item?.locationId.name}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-12 mt-7 xl:mb-36">
        <Details
          timerDetails={timerDetailData?.item}
          isLoading={isTimerDetailDataLoading}
          readingMessages={readingMessages}
          sectionDiv={sectionDiv}
        />
        <div className="flex flex-col">
          <CycleClock
            timerClockTimeArray={timerClockTimeArray}
            cycleClockTimeArray={cycleClockTimeArray}
            isCycleClockRunning={isCycleClockRunning}
            isCycleClockStarting={isCycleClockStarting}
            isCycleClockStopping={isCycleClockStopping}
            runCycle={runCycle}
            stopCycle={stopCycle}
            progress={progress}
            isAbleToStart={!isTimerControllerEnded}
          />
          <Results unitsCreated={unitsCreated} totals={totals} />
        </div>
        {/* End Medium - large screen show timer data */}
      </div>
      <Footer
        progress={progress}
        isLoading={isTimerDetailDataLoading}
        timeZone={timerDetailData?.item?.locationId.timeZone}
      />
      <div className="slides">
        {/* Bottom Slide Menu */}
        <BottomMenu
          stopMenu={stopMenu}
          setStopMenu={setStopMenu}
          stopReasons={stopReasons}
          setStopReasons={setStopReasons}
        />
        {/* Right Side Slide Menu */}
        <SideMenu
          endMenu={endMenu}
          setEndMenu={setEndMenu}
          setIsEndProductionModalOpen={setIsEndProductionModalOpen}
        />
      </div>
      <EndProductionModal
        isOpen={isEndProductionModalOpen}
        onClose={() => setIsEndProductionModalOpen(false)}
        stopTimer={stopTimer}
        timerId={timerId}
        controllerTimerId={
          controllerTimer?.items[0]?._id
            ? (controllerTimer?.items[0]._id as string)
            : ""
        }
        isTimerClockRunning={isTimerClockRunning}
      />
    </div>
  )
}

export default Controller
