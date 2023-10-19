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
import useAssignJobToTimer from "../../../../../hooks/timers/useAssignJobToTimer"
import { useQueryClient } from "@tanstack/react-query"
import useGetJobTimerByTimerId from "../../../../../hooks/jobTimer/useGetJobTimerByTimerId"
import useEndControllerTimer from "../../../../../hooks/timers/useEndControllerTimer"
import { Socket } from "socket.io-client"
import { initializeSocket } from "../../../../../helpers/socket"
import useGetAllTimerLogsCount from "../../../../../hooks/timerLogs/useGetAllTimerLogsCount"

const Controller = ({ timerId }: { timerId: string }) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const queryClient = useQueryClient()
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const { data: controllerTimer, refetch: refetchController } =
    useGetControllerTimer(timerId)
  const { data: cycleTimer, refetch: cycleRefetch } = useGetCycleTimer(timerId)

  const { mutate: addControllerTimer } = useAddControllerTimer()
  const { mutate: addCycleTimer } = useAddCycleTimer()
  const { mutate: endAddCycleTimer, isLoading: isEndAddCycleTimerLoading } =
    useEndAddCycleTimer()
  const { mutate: endControllerTimer } = useEndControllerTimer()
  const { mutate: endCycleTimer, isLoading: isEndCycleTimerLoading } =
    useEndCycleTimer()

  const { mutate: addTimerLogs } = useAddTimerLog()

  const { data: timerLogsCount, refetch: refetchTimerLogs } =
    useGetAllTimerLogsCount({
      locationId: timerDetailData?.item?.locationId._id,
      timerId,
    })

  const { data: jobTimer, isLoading: isJobTimerLoading } =
    useGetJobTimerByTimerId({
      locationId: timerDetailData?.item?.locationId._id,
      timerId,
    })

  const { mutate: assignJobToTimer } = useAssignJobToTimer()

  const sectionDiv = useRef<HTMLDivElement>(null)

  const [isTimerControllerEnded, setIsTimerControllerEnded] = useState(false)
  const [isLocationTimeEnded, setIsLocationTimeEnded] = useState(false)
  const [stopMenu, setStopMenu] = useState(false)
  const [endMenu, setEndMenu] = useState(false)
  const [progress, setProgress] = useState(100)
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

  const [updateJob, setUpdateJob] = useState<boolean>(false)
  const [jobUpdateId, setJobUpdateId] = useState<string>("")
  const [defaultOperator, setDefaultOperator] = useState<object>()
  const [isEndProductionModalOpen, setIsEndProductionModalOpen] =
    useState(false)
  const [isCycleClockStarting, setIsCycleClockStarting] = useState(false)
  const [isCycleClockStopping, setIsCycleClockStopping] = useState(false)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [cycleClockInSeconds, setCycleClockInSeconds] = useState(0)
  const [cycleClockTimeArray, setCycleCockTimeArray] = useState<
    Array<number | string>
  >([])

  const [readingMessages, setReadingMessages] = useState<string[]>([])

  const [stopReasons, setStopReasons] = useState<T_TimerStopReason[]>([])
  const intervalRef = useRef<any>()
  let socket: Socket<any, any> | undefined

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    socket = initializeSocket()
    const runSocket = async (data: any) => {
      if (data.action === "add") {
        runIntervalClock()
      }
      if (data.action === "endAndAdd") {
        setIsCycleClockStopping(true)
        setCycleClockInSeconds(0)
        try {
          const { isSuccess } = await cycleRefetch()
          if (isSuccess) {
            runIntervalClock()
            setIsCycleClockStarting(false)
          }
          refetchTimerLogs()
        } catch (error) {
          throw error
        }
      }
      if (data.action === "end") {
        stopInterval()
        setIsCycleClockStarting(false)
      }
      if (data.action === "update-cycle" && data.timers.length > 0) {
        const timeZone = timerDetailData?.item?.locationId.timeZone
        const timerStart = dayjs.tz(
          dayjs(data.timers[0].createdAt),
          timeZone ? timeZone : ""
        )
        const currentDate = dayjs.tz(dayjs(), timeZone ? timeZone : "")
        const secondsLapse = currentDate.diff(timerStart, "seconds", true)
        setCycleClockInSeconds(secondsLapse)
      }
      if (data.action === "update-operator") {
        console.log("data.action", data.action, data.user)
        setDefaultOperator(data.user)
      }
    }

    socket?.on(`timer-${timerId}`, runSocket)

    return () => {
      socket?.off(`timer-${timerId}`, runSocket)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refocusing when tab minimize or change the tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      // If working for when tab is visible
      if (document.visibilityState === "visible") {
        try {
          cycleRefetch()
          const response = await refetchController()
          if (response?.data?.items[0]?.endAt) {
            setIsTimerControllerEnded(true)
          } else {
            if (!setIsTimerControllerEnded) {
              runIntervalClock()
            }
          }
        } catch (error) {
          throw error
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const currentDate = dayjs
    .tz(
      dayjs(),
      timerDetailData?.item?.locationId.timeZone
        ? timerDetailData?.item?.locationId.timeZone
        : ""
    )
    .format("YYYY-MM-DD HH:mm:ss")

  let interval: any
  useEffect(() => {
    return () => {
      clearInterval(interval)
    }
  }, [])

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
    interval = setInterval(() => {
      setTimerClockInSeconds((previousState: number) => previousState + 1)
    }, 1000)
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
      setIsCycleClockRunning(false)
      setIsTimerClockRunning(false)
      setProgress(0)
      setIsTimerControllerEnded(true)
      endControllerTimer(timerId, callBackReq)
    }, 3000)
  }

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
      if (controllerTimer?.items[0]?.endAt) {
        setIsTimerControllerEnded(true)
      } else {
        runTimer()
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
      if (
        returnData.message ===
        "Target count exceeded, log was assigned to stock."
      ) {
        toast.error(String(returnData.message))
        setUpdateJob(true)
        setJobUpdateId(returnData?.data?._id)
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  useEffect(() => {
    setCycleCockTimeArray(hourMinuteSecondMilli(cycleClockInSeconds))
    const percent = getPercentage(
      cycleClockInSeconds,
      (timerDetailData?.item?.partId.time as number) > 0
        ? timerDetailData?.item?.partId.time
        : 10
    )
    setProgress(percent)
  }, [cycleClockInSeconds])

  const runIntervalClock = () => {
    if (isTimerControllerEnded !== true) {
      stopInterval()
      setIsCycleClockStopping(false)
      intervalRef.current = setInterval(() => {
        setCycleClockInSeconds((previousState: number) => previousState + 0.1)
      }, 100)
    }
  }
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
            setTimeout(
              function () {
                if (!isCycleClockRunning && !fromDb) {
                  addCycleTimer({ timerId }, callBackReq)
                }
                setIsCycleClockRunning(true)
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
              },
              fromDb ? 0 : 3000
            )
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
    setIsCycleClockStarting(true)
    setCycleClockInSeconds(0)
    startingTimerReadings([
      `${currentDate} - Stopping timer`,
      `${currentDate} - Timer stopped`,
      `${currentDate} - Timer cycle reset`,
      `${currentDate} - One unit created`,
    ])
    if (stopReasons.length === 0) {
      endAddCycleTimer(timerId, callBackReq)
      timeLogCall(jobTimer?.item?.jobId, ["Unit Created"])
      setProgress(0)
    } else {
      endCycleTimer(timerId, callBackReq)
      timeLogCall(jobTimer?.item?.jobId, stopReasons)
      setProgress(0)
      setStopReasons([])
      setStopMenu(false)
      setEndMenu(false)
      setIsCycleClockRunning(false)
    }
  }

  useEffect(() => {
    sectionDiv.current?.scrollIntoView({ behavior: "smooth" })
  }, [readingMessages])

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
        runIntervalClock()
        runCycle(true)
      }
    }
  }, [cycleTimer, jobTimer])

  useEffect(() => {
    if (
      timerDetailData?.item &&
      timerLogsCount?.itemCount &&
      timerDetailData?.item > 0 &&
      timerClockInSeconds > 0
    ) {
      const count = timerLogsCount?.item?.count as number
      const hoursLapse =
        timerClockInSeconds > 3600 ? timerClockInSeconds / 3600 : 1
      setTotals({
        unitsPerHour: count / hoursLapse,
        tonsPerHour:
          (count * (timerDetailData?.item?.partId.tons as number)) / hoursLapse,
        totalTons: count * (timerDetailData?.item?.partId.tons as number),
      })
    }
  }, [timerLogsCount, timerDetailData])

  useEffect(() => {
    if (timerDetailData?.item && timerClockInSeconds > 0) {
      const count = timerLogsCount?.item?.count as number
      const hoursLapse =
        timerClockInSeconds > 3600 ? timerClockInSeconds / 3600 : 1
      setTotals({
        unitsPerHour: count / Math.round(hoursLapse),
        tonsPerHour:
          (count * (timerDetailData?.item?.partId.tons as number)) /
          Math.round(hoursLapse),
        totalTons: count * (timerDetailData?.item?.partId.tons as number),
      })
    }
  }, [timerDetailData, timerLogsCount])

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

  // function of add time log call
  const timeLogCall = (jobId: any, stopReasons: any) => {
    addTimerLogs(
      {
        timerId,
        machineId: timerDetailData?.item?.machineId._id as string,
        machineClassId: timerDetailData?.item?.machineClassId._id as string,
        locationId: timerDetailData?.item?.locationId._id as string,
        factoryId: timerDetailData?.item?.factoryId._id as string,
        jobId: jobId,
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
  }

  // useEffect run is end add cycle timer loading change
  useEffect(() => {
    if (isEndAddCycleTimerLoading) {
      stopInterval()
    }
  }, [isEndAddCycleTimerLoading])

  // useEffect run is end cycle timer loading change
  useEffect(() => {
    if (isEndCycleTimerLoading) {
      stopInterval()
    }
  }, [isEndCycleTimerLoading])

  // function of stop cycle interval
  const stopInterval = () => {
    clearInterval(intervalRef.current)
  }

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
          isTimerDetailDataLoading={isTimerDetailDataLoading}
          readingMessages={readingMessages}
          sectionDiv={sectionDiv}
          updateJob={updateJob}
          jobUpdateId={jobUpdateId}
          defaultOperator={defaultOperator}
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
            isEndAddCycleTimerLoading={isEndAddCycleTimerLoading}
            isEndCycleTimerLoading={isEndCycleTimerLoading}
          />
          <Results
            unitsCreated={(timerLogsCount?.item?.count as number) ?? 0}
            totals={totals}
          />
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
