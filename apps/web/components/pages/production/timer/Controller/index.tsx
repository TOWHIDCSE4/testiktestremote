"use client"
import { createContext, useContext, useState, useEffect, useRef } from "react"
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
import {
  T_BackendResponse,
  T_JobTimer,
  T_TimerStopReason,
} from "custom-validator"
import toast from "react-hot-toast"
import useGetCycleTimer from "../../../../../hooks/timers/useGetCycleTimer"
import useEndCycleTimer from "../../../../../hooks/timers/useEndCycleTimer"
import useAddTimerLog from "../../../../../hooks/timerLogs/useAddTimerLog"
import useAddControllerTimer from "../../../../../hooks/timers/useAddControllerTimer"
import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"
import useAssignJobToTimer from "../../../../../hooks/timers/useAssignJobToTimer"
import { useQueryClient } from "@tanstack/react-query"
import useGetJobTimerByTimerId from "../../../../../hooks/jobTimer/useGetJobTimerByTimerId"
import useEndControllerTimer from "../../../../../hooks/timers/useEndControllerTimer"

const Controller = ({ timerId }: { timerId: string }) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const queryClient = useQueryClient()
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const { data: controllerTimer, isLoading: isControllerTimerLoading } =
    useGetControllerTimer(timerId)
  const { data: cycleTimer, isLoading: isCycleTimerLoading } =
    useGetCycleTimer(timerId)
  console.log("useGetCycleTimer", cycleTimer)
  const { mutate: addControllerTimer, isLoading: isAddControllerTimerLoading } =
    useAddControllerTimer()
  const { mutate: addCycleTimer, isLoading: isAddCycleTimerLoading } =
    useAddCycleTimer()
  const { mutate: endAddCycleTimer, isLoading: isEndAddCycleTimerLoading } =
    useEndAddCycleTimer()
  const { mutate: endControllerTimer, isLoading: isEndControllerTimerLoading } =
    useEndControllerTimer()
  const { mutate: endCycleTimer, isLoading: isEndCycleTimerLoading } =
    useEndCycleTimer()

  const { mutate: addTimerLogs, isLoading: isAddTimerLogsLoading } =
    useAddTimerLog()

  const { data: timerLogs, isLoading: isTimerLogsLoading } = useGetAllTimerLogs(
    { locationId: timerDetailData?.item?.locationId._id, timerId }
  )

  const { data: jobTimer, isLoading: isJobTimerLoading } =
    useGetJobTimerByTimerId({
      locationId: timerDetailData?.item?.locationId._id,
      timerId,
    })

  const { mutate: assignJobToTimer, isLoading: isAssignJobToTimerLoading } =
    useAssignJobToTimer()

  const sectionDiv = useRef<HTMLDivElement>(null)

  const [isTimerControllerEnded, setIsTimerControllerEnded] = useState(false)
  const [isLocationTimeEnded, setIsLocationTimeEnded] = useState(false)
  const [stopMenu, setStopMenu] = useState(false)
  const [endMenu, setEndMenu] = useState(false)
  const [progress, setProgress] = useState(100)
  const [unitsCreated, setUnitsCreated] = useState(0)
  const [totalCycle, setTotalCycle] = useState(0)
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
      setProgress(100)
      setIsTimerControllerEnded(true)
      endControllerTimer(timerId, callBackReq)
      if (isCycleClockRunning) {
        addTimerLogs(
          {
            timerId,
            machineId: timerDetailData?.item?.machineId._id as string,
            machineClassId: timerDetailData?.item?.machineClassId._id as string,
            locationId: timerDetailData?.item?.locationId._id as string,
            factoryId: timerDetailData?.item?.factoryId._id as string,
            jobId: jobTimer?.item.jobId as string,
            partId: timerDetailData?.item?.partId._id as string,
            time: cycleClockInSeconds,
            operator: timerDetailData?.item?.operator._id as string,
            status:
              (timerDetailData?.item?.partId.time as number) >
              cycleClockInSeconds
                ? "Gain"
                : "Loss",
            stopReason: ["Unit Created", "Production Ended"],
            cycle: totalCycle + 1,
          },
          callBackReqAddTimerLog
        )
        setStopReasons([])
        setStopMenu(false)
        setEndMenu(false)
        setUnitsCreated(unitsCreated + 1)
      }
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

  const callBackReqAddTimerLog = {
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
    if (!isLocationTimeEnded) {
      if (timerDetailData?.item?.operator) {
        if (jobTimer?.item?.jobId) {
          if (!isTimerControllerEnded) {
            setIsCycleClockStarting(true)
            startingTimerReadings([
              `${currentDate} - Starting timer`,
              `${currentDate} - Timer started`,
            ])
            // setTimeout(
            //   function () {
            if (!isCycleClockRunning && !fromDb) {
              addCycleTimer({ timerId }, callBackReq)
            }
            const interval: any = setInterval(() => {
              setCycleClockInSeconds(
                (previousState: number) => previousState + 0.01
              )
            }, 7)
            setCycleClockIntervalId(interval)
            setIsCycleClockRunning(true)
            setIsCycleClockStopping(false)
            if (!isTimerClockRunning && !fromDb) {
              addControllerTimer(
                {
                  timerId,
                  locationId: timerDetailData?.item?.locationId._id,
                },
                callBackReq
              )
              runTimer()
            }
            setIsCycleClockStarting(false)
            //   },
            //   fromDb ? 0 : 3000
            // )
          } else {
            toast.error("You already ended this timer")
          }
        } else {
          toast.error("You need to assigned a job to this timer first")
        }
      } else {
        toast.error("You need to assigned an operator to this timer first")
      }
    } else {
      toast.error(controllerTimer?.message as string, { duration: 5000 })
    }
  }

  const stopCycle = () => {
    setIsCycleClockStopping(true)
    clearInterval(cycleClockIntervalId)
    startingTimerReadings([
      `${currentDate} - Stopping timer`,
      `${currentDate} - Timer stopped`,
      `${currentDate} - Timer cycle reset`,
      `${currentDate} - One unit created`,
    ])
    if (stopReasons.length === 0) {
      endAddCycleTimer(timerId, callBackReq)
      addTimerLogs(
        {
          timerId,
          machineId: timerDetailData?.item?.machineId._id as string,
          jobId: jobTimer?.item.jobId as string,
          partId: timerDetailData?.item?.partId._id as string,
          machineClassId: timerDetailData?.item?.machineClassId._id as string,
          factoryId: timerDetailData?.item?.factoryId._id as string,
          locationId: timerDetailData?.item?.locationId._id as string,
          time: cycleClockInSeconds,
          operator: timerDetailData?.item?.operator._id as string,
          status:
            (timerDetailData?.item?.partId.time as number) > cycleClockInSeconds
              ? "Gain"
              : "Loss",
          stopReason: ["Unit Created"],
          cycle: totalCycle + 1,
        },
        callBackReqAddTimerLog
      )
      setTimeout(function () {
        setCycleClockInSeconds(0)
        setIsCycleClockStopping(false)
        setUnitsCreated(unitsCreated + 1)
        setStopMenu(false)
        setEndMenu(false)
        if (timerDetailData?.item?.partId.time === 0) {
          setProgress(100)
        } else {
          setProgress(0)
        }
        const interval: any = setInterval(() => {
          setCycleClockInSeconds(
            (previousState: number) => previousState + 0.01
          )
        }, 7)
        setCycleClockIntervalId(interval)
      }, 3000)
    } else {
      endCycleTimer(timerId, callBackReq)
      addTimerLogs(
        {
          timerId,
          machineId: timerDetailData?.item?.machineId._id as string,
          machineClassId: timerDetailData?.item?.machineClassId._id as string,
          locationId: timerDetailData?.item?.locationId._id as string,
          factoryId: timerDetailData?.item?.factoryId._id as string,
          jobId: null,
          partId: timerDetailData?.item?.partId._id as string,
          time: cycleClockInSeconds,
          operator: timerDetailData?.item?.operator._id as string,
          status:
            (timerDetailData?.item?.partId.time as number) > cycleClockInSeconds
              ? "Gain"
              : "Loss",
          stopReason: stopReasons,
          cycle: totalCycle + 1,
        },
        callBackReqAddTimerLog
      )
      setTimeout(function () {
        setProgress(100)
        setStopReasons([])
        setStopMenu(false)
        setEndMenu(false)
        setCycleClockInSeconds(0)
        setIsCycleClockRunning(false)
      }, 3000)
    }
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
    } else {
      if (
        controllerTimer?.items?.length === 0 &&
        !controllerTimer.error &&
        controllerTimer?.message
      ) {
        setIsTimerControllerEnded(true)
        setIsLocationTimeEnded(true)
        toast.error(controllerTimer?.message as string, { duration: 5000 })
      }
    }
  }, [controllerTimer])

  useEffect(() => {
    if (cycleTimer?.items && cycleTimer?.items.length > 0 && jobTimer?.item) {
      const timeZone = timerDetailData?.item?.locationId.timeZone
      const timerStart = dayjs.tz(
        dayjs(cycleTimer?.items[0].createdAt),
        timeZone ? timeZone : ""
      )
      const currentDate = dayjs.tz(dayjs(), timeZone ? timeZone : "")
      const secondsLapse = currentDate.diff(timerStart, "seconds", true)
      setCycleClockInSeconds(secondsLapse)
      if (!cycleTimer?.items[0].endAt) {
        if (timerDetailData?.item?.partId.time === 0) {
          setProgress(100)
        } else {
          setProgress(secondsLapse)
        }
        runCycle(true)
      }
    }
  }, [cycleTimer, jobTimer])

  useEffect(() => {
    if (timerLogs?.items && timerLogs?.items?.length > 0) {
      const unitsCreatedCount = timerLogs?.items?.filter((item) =>
        item.stopReason.includes("Unit Created")
      ).length
      setUnitsCreated(unitsCreatedCount as number)
      setTotalCycle(timerLogs.itemCount as number)
    }
  }, [timerLogs])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (
      timerDetailData?.item &&
      timerLogs?.itemCount &&
      timerLogs?.items?.length > 0 &&
      timerClockInSeconds > 0
    ) {
      const unitsCreatedCount = timerLogs?.items?.filter((item) =>
        item.stopReason.includes("Unit Created")
      ).length
      const hoursLapse =
        timerClockInSeconds > 3600 ? timerClockInSeconds / 3600 : 1
      setTotals({
        unitsPerHour: unitsCreatedCount / hoursLapse,
        tonsPerHour:
          (unitsCreatedCount * (timerDetailData?.item?.partId.tons as number)) /
          hoursLapse,
        totalTons:
          unitsCreatedCount * (timerDetailData?.item?.partId.tons as number),
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
          (unitsCreated * (timerDetailData?.item?.partId.tons as number)) /
          Math.round(hoursLapse),
        totalTons:
          unitsCreated * (timerDetailData?.item?.partId.tons as number),
      })
    }
  }, [timerDetailData, unitsCreated])

  useEffect(() => {
    if (!isTimerDetailDataLoading && timerDetailData?.item) {
      assignJobToTimer(
        {
          timerId,
          partId: timerDetailData?.item?.partId._id as string,
          factoryId: timerDetailData?.item?.factoryId._id as string,
          locationId: timerDetailData?.item?.locationId._id as string,
          status: "Active",
        },
        {
          onSuccess: (returnData: T_BackendResponse) => {
            if (!returnData.error) {
              toast.success("Job automatically assigned to this timer", {
                duration: 5000,
              })
              queryClient.invalidateQueries({
                queryKey: ["job-timer-timer"],
              })
            }
          },
          onError: (err: any) => {
            toast.error(String(err))
          },
        }
      )
    }
  }, [timerDetailData])

  // const toggleTheme = () => {
  //   document.documentElement.classList.toggle("dark")
  // }

  return (
    <div className="h-screen overflow-auto 2xl:text-lg  dark:bg-dark-blue dark:text-white">
      <Header
        progress={progress}
        isLoading={isTimerDetailDataLoading}
        location={timerDetailData?.item?.locationId.name}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-12 mt-7 dark:text-white">
        <Details
          timerDetails={timerDetailData?.item}
          isLoading={isTimerDetailDataLoading}
          readingMessages={readingMessages}
          sectionDiv={sectionDiv}
          jobTimer={jobTimer?.item as T_JobTimer}
          isJobTimerLoading={isJobTimerLoading}
          isCycleClockRunning={isCycleClockRunning}
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
            isAbleToStart={!isTimerControllerEnded && !isJobTimerLoading}
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
          isCycleClockRunning={isCycleClockRunning}
          stopCycle={stopCycle}
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
