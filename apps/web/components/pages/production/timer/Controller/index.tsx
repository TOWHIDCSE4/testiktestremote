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
  T_Timer,
  T_TimerStopReason,
} from "custom-validator"
import toast from "react-hot-toast"
import useGetCycleTimer from "../../../../../hooks/timers/useGetCycleTimer"
import useEndCycleTimer from "../../../../../hooks/timers/useEndCycleTimer"
import useAddTimerLog from "../../../../../hooks/timerLogs/useAddTimerLog"
import useAddControllerTimer from "../../../../../hooks/timers/useAddControllerTimer"
import useAssignJobToTimer from "../../../../../hooks/timers/useAssignJobToTimer"
import useGetJobTimerByTimerId from "../../../../../hooks/jobTimer/useGetJobTimerByTimerId"
import useEndControllerTimer from "../../../../../hooks/timers/useEndControllerTimer"
import useProfile from "../../../../../hooks/users/useProfile"
import useGetTimerJobs from "../../../../../hooks/timers/useGetTimerJobs"
import { useSocket } from "../../../../../store/useSocket"
import useStoreTimer from "../../../../../store/useStoreTimer"
import TimerLogsModal from "../modals/TimerLogsModal"
import { useQueryClient } from "@tanstack/react-query"
import { set } from "lodash"
import Table from "../TimerTracker/SingleTimerTracker/Table"
import { getObjectId } from "../../../../../helpers/ids"
import { FaCircleNotch } from "react-icons/fa"
import { Button } from "@mui/material"
import { USER_ROLES } from "../../../../../helpers/constants"
import useGetAllTimerLogsCount from "../../../../../hooks/timerLogs/useGetAllTimerLogsCount"
import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"
import useGetCycleTimerRealTime from "../../../../../hooks/timers/useGetCycleTimerRealTime"

const Controller = ({ timerId }: { timerId: string }) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  let socket = useSocket((store) => store.instance)
  const { isTimerStop, updateIsTimerStop } = useStoreTimer((store) => store)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()

  const { data: controllerTimer, refetch: refetchController } =
    useGetControllerTimer(timerId)
  const {
    data: cycleTimer,
    refetch: cycleRefetch,
    isLoading: isCycleTimerLoading,
  } = useGetCycleTimerRealTime(timerId)
  console.log("LOG INFO cycleTImerData", cycleTimer)

  const { mutate: addControllerTimer } = useAddControllerTimer()
  const { mutate: addCycleTimer } = useAddCycleTimer()
  const { mutate: endAddCycleTimer, isLoading: isEndAddCycleTimerLoading } =
    useEndAddCycleTimer()
  const { mutate: endControllerTimer } = useEndControllerTimer()
  const { mutate: endCycleTimer, isLoading: isEndCycleTimerLoading } =
    useEndCycleTimer()
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)

  const {
    data: timerJobs,
    isLoading: isTimerJobsLoading,
    refetch: timerJobsRefetch,
  } = useGetTimerJobs(
    getObjectId(timerDetailData?.item?.locationId),
    getObjectId(timerDetailData?.item?.factoryId),
    getObjectId(timerDetailData?.item?.partId)
  )

  // const onTimerDetailLoad = (timerDetail: T_Timer) => {
  //   setFactoryId(getObjectId(timerDetail?.factoryId))
  //   setLocationId(getObjectId(timerDetail?.locationId))
  //   setPartId(getObjectId(timerDetail?.partId))
  // }

  const { mutate: addTimerLogs } = useAddTimerLog()

  const { data: timerLogsCount, refetch: refetchTimerLogs } =
    useGetAllTimerLogsCount({
      locationId: timerDetailData?.item?.locationId._id,
      timerId,
    })

  const { data: timerLogsData } = useGetAllTimerLogs({
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

  const [defaultOperator, setDefaultOperator] = useState<object>()
  const [isEndProductionModalOpen, setIsEndProductionModalOpen] =
    useState(false)
  const [isCycleClockStarting, setIsCycleClockStarting] = useState(false)
  const [isCycleClockStopping, setIsCycleClockStopping] = useState(false)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [isTimerLogsModalOpen, setIsTimerLogsModalOpen] = useState(false)
  const [isJobSwitch, setIsJobSwitch] = useState(false)
  const [cycleClockInSeconds, setCycleClockInSeconds] = useState(0)
  const [cycleClockTimeArray, setCycleCockTimeArray] = useState<
    Array<number | string>
  >([])

  const [readingMessages, setReadingMessages] = useState<string[]>([])
  const [stopReasons, setStopReasons] = useState<T_TimerStopReason[]>([])
  const [endTimer, setEndTimer] = useState<boolean>(false)
  const intervalRef = useRef<any>()
  const queryClient = useQueryClient()
  const currentDate = dayjs
    .tz(
      dayjs(),
      timerDetailData?.item?.locationId.timeZone
        ? timerDetailData?.item?.locationId.timeZone
        : ""
    )
    .format("YYYY-MM-DD HH:mm:ss")

  const endAndAddCallback = () => {
    setCycleClockInSeconds(0)
    setIsCycleClockStarting(false)
    runIntervalClock()
  }
  const endCallback = () => {
    stopInterval()
    setCycleClockInSeconds(0)
    setProgress(0)
    setIsCycleClockStopping(true)
    setIsCycleClockRunning(false)
    setIsCycleClockStarting(false)
  }
  const stopPressCallback = () => {
    setCycleClockInSeconds(0)
  }
  const preAddCallback = () => {
    setIsTimerClockRunning(true)
    setIsCycleClockRunning(true)
  }
  const addCallback = () => {
    runIntervalClock()
  }

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   const runSocket = async (data: any) => {
  //     if (data.action === "pre-add") {
  //       preAddCallback()
  //     }
  //     if (data.action === "add") {
  //       addCallback()
  //     }
  //     if (data.action === "endAndAdd") {
  //       endAndAddCallback()
  //     }
  //     if (data.action === "end") {
  //       endCallback()
  //     }
  //     if (data.action === "end-controller") {
  //       setCycleClockInSeconds(0)
  //       setProgress(0)
  //       setIsCycleClockStopping(true)
  //       setIsCycleClockRunning(false)
  //       setIsCycleClockStarting(false)
  //       stopInterval()
  //     }
  //     if (data.action === "update-cycle" && data.timers.length > 0) {
  //       const secondsLapse = handleInitializeSeconds(data.timers[0].createdAt)
  //       setCycleClockInSeconds(secondsLapse)
  //     }
  //     if (data.action === "update-operator") {
  //       if (data.user) {
  //         if (data.user.role === "Personnel") {
  //           setDefaultOperator(data.user)
  //         }
  //       }
  //     }
  //     if (data.action === "job-change") {
  //       timerJobsRefetch()
  //       switch (data?.data?.recommendation) {
  //         case "SWITCH":
  //           setJobUpdateId(data?.data?.jobToBe)
  //           setIsJobSwitch(true)
  //           break

  //         case "STOP":
  //           stopCounter()
  //           setJobUpdateId("")
  //           updateIsTimerStop(true)
  //           break
  //       }
  //     }
  //     if (data.action === "stop-press") {
  //       stopPressCallback()
  //     }
  //     if (data.action === "change-job") {
  //       setJobUpdateId(data.jobInfo.jobId ?? "")
  //       toast.success("Job change succesfully", {
  //         duration: 5000,
  //         position: "bottom-center",
  //       })
  //     }
  //   }

  //   socket?.on(`timer-${timerId}`, runSocket)
  //   socket?.emit("join-timer", {
  //     action: "emit-operator",
  //     timerId: timerId,
  //     user: userProfile,
  //   })
  //   return () => {
  //     socket?.off(`timer-${timerId}`, runSocket)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [socket, timerId])

  useEffect(() => {
    if (defaultOperator) {
      cycleRefetch()
    }
  }, [])

  let interval: any

  useEffect(() => {
    return () => {
      clearInterval(interval)
    }
  }, [])

  const startingTimerReadings = (messages: string[]) => {
    setReadingMessages((previousState) => [...previousState, ...messages])
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

  useEffect(() => {
    const stopTimer = () => {
      if (endTimer) {
        clearInterval(interval)
        setIsTimerClockRunning(false)
      }
    }
    stopTimer()
  }, [endTimer])

  const stopTimer = () => {
    stopInterval()
    setProgress(0)
    startingTimerReadings([
      `${currentDate} - Ending timer production`,
      `${currentDate} - Timer stopped`,
      `${currentDate} - Timer production ended`,
    ])
    setCycleClockInSeconds(0)

    setIsCycleClockStopping(true)
    setEndMenu(false)
    setIsCycleClockRunning(false)
    setIsTimerClockRunning(false)
    setIsTimerControllerEnded(true)
    endControllerTimer(timerId, callBackReq)
  }

  useEffect(() => {
    if (controllerTimer?.items && controllerTimer?.items.length > 0) {
      const secondsLapse = handleInitializeSeconds(
        controllerTimer?.items[0].createdAt,
        controllerTimer?.items[0].endAt
      )
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
        toast.error(controllerTimer?.message as string, {
          duration: 5000,
          position: "bottom-center",
        })
      }
    }
  }, [controllerTimer])

  // Cycle Clock

  const callBackReq = {
    onSuccess: (returnData: T_BackendResponse) => {
      if (!returnData.error) {
      } else {
        toast.error(String(returnData.message), {
          duration: 5000,
          position: "bottom-center",
        })
      }
    },
    onError: (err: any) => {
      toast.error(String(err), { duration: 5000, position: "bottom-center" })
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
    setProgress(cycleClockInSeconds > 0 ? percent : 0)
  }, [cycleClockInSeconds])

  const runIntervalClock = () => {
    if (isTimerControllerEnded !== true) {
      stopInterval()
      if (!isCycleClockStarting) {
        setTimeout(() => {
          setIsCycleClockStopping(false)
        }, 3000)
      }

      intervalRef.current = setInterval(() => {
        setCycleClockInSeconds((previousState: number) => previousState + 0.1)
      }, 100)
    }
  }

  const runCycle = (fromDb?: boolean) => {
    if (isLocationTimeEnded)
      return toast.error(controllerTimer?.message as string, {
        duration: 5000,
        position: "bottom-center",
      })

    if (!timerDetailData?.item?.operator._id)
      return toast.error("You need to assign an operator to this timer first", {
        duration: 5000,
        position: "bottom-center",
      })

    if (getJobsId() === "")
      return toast.error("You need to assign a job to this timer first", {
        duration: 5000,
        position: "bottom-center",
      })

    if (isTimerControllerEnded)
      return toast.error("You already ended this timer", {
        duration: 5000,
        position: "bottom-center",
      })

    setIsCycleClockStarting(true)
    startingTimerReadings([
      `${currentDate} - Starting timer`,
      `${currentDate} - Timer started`,
    ])
    updateIsTimerStop(false)
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
    }
    runIntervalClock()

    setIsCycleClockStarting(false)
  }

  const getJobsId = () => {
    return getObjectId(timerJobs?.items[0])
  }

  const stopCycle = ({ isStopInterval } = { isStopInterval: false }) => {
    // avoid stopping cycle when below 1 second
    if (cycleClockInSeconds < 1) {
      return
    }
    updateIsTimerStop(false)
    setIsCycleClockStopping(true)
    setIsCycleClockStarting(true)

    setCycleClockInSeconds(0)
    socket?.emit("stop-press", {
      action: "stop-press",
      timerId: timerId,
      message: "stop the timer",
    })
    startingTimerReadings([
      `${currentDate} - Stopping timer`,
      `${currentDate} - Timer stopped`,
      `${currentDate} - Timer cycle reset`,
      `${currentDate} - One unit created`,
    ])
    const jobsId = getJobsId()

    if (stopReasons.length === 0) {
      endAddCycleTimer(timerId, callBackReq)
      timeLogCall(jobsId, ["Unit Created"])
      setProgress(0)
    } else {
      endCycleTimer(timerId, callBackReq)
      timeLogCall(jobsId, stopReasons)
      setProgress(0)
      setStopReasons([])
      setStopMenu(false)
      setEndMenu(false)
    }

    queryClient.setQueriesData(
      ["timer-logs-count", timerDetailData?.item?.locationId._id, timerId],
      (query: any) => {
        if (
          query &&
          typeof query?.item?.count === "number" &&
          !isStopInterval
        ) {
          const current = query?.item?.count
          console.log("tung tung tung", query, current)

          return set(query, ["item", "count"], current + 1)
        }
        return query
      }
    )
    queryClient.setQueriesData(
      ["timer-logs", timerDetailData?.item?.locationId._id, timerId],
      (query: any) => {
        const newData = {
          createdAt: new Date(),
          timerId,
          machineId: timerDetailData?.item?.machineId,
          machineClassId: timerDetailData?.item?.machineClassId,
          locationId: timerDetailData?.item?.locationId,
          factoryId: timerDetailData?.item?.factoryId,
          jobId: jobTimer?.item || "",
          partId: timerDetailData?.item?.partId,
          time: cycleClockInSeconds,
          operator: timerDetailData?.item?.operator || null,
          operatorName: timerDetailData?.item?.operator?.firstName as string,
          status:
            (timerDetailData?.item?.partId.time as number) > cycleClockInSeconds
              ? "Gain"
              : "Loss",
          stopReason: stopReasons,
          cycle: (timerLogsCount?.item?.count as number) + 1,
        }
        if (query?.items) {
          query.items.unshift(newData)
          if (!isStopInterval) {
            query.itemCount += 1
          }
        }
        return query
      }
    )
    // if offline run endANdAdd callback manually

    if (isStopInterval) {
      stopInterval()
      setIsCycleClockRunning(false)
      setIsCycleClockStarting(false)
      setIsCycleClockStopping(false)
      stopTimer()
      endCallback()
      return
    } else {
      stopPressCallback()
      endAndAddCallback()
      runCycle()
    }
  }

  useEffect(() => {
    sectionDiv.current?.scrollIntoView({ behavior: "smooth" })
  }, [readingMessages])

  useEffect(() => {
    if (
      cycleTimer?.items &&
      cycleTimer?.items.length > 0 &&
      getJobsId() !== "" &&
      isTimerStop !== true
    ) {
      const secondsLapse = handleInitializeSeconds(
        cycleTimer?.items[0].createdAt
      )
      setCycleClockInSeconds(secondsLapse)
      if (
        !cycleTimer?.items[0].endAt &&
        !isTimerDetailDataLoading &&
        !isTimerJobsLoading
      ) {
        if (timerDetailData?.item?.partId.time === 0) {
          setProgress(0)
        } else {
          setProgress(secondsLapse)
        }
        runIntervalClock()
        runCycle(true)
      }
    }
  }, [
    cycleTimer,
    getJobsId(),
    isTimerDetailDataLoading,
    isTimerJobsLoading,
    isCycleTimerLoading,
  ])

  const handleInitializeSeconds = (createdAt?: Date, endAt?: Date | null) => {
    const timeZone = timerDetailData?.item?.locationId.timeZone
    const timerStart = dayjs.tz(dayjs(createdAt), timeZone ? timeZone : "")

    return (
      dayjs
        .tz(endAt ? dayjs(endAt) : dayjs(), timeZone ? timeZone : "")
        .diff(timerStart, "seconds", true) ?? ""
    )
  }

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
    if (isTimerDetailDataLoading !== true) {
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
                position: "bottom-center",
              })
            }
          },
          onError: (err: any) => {
            toast.error(String(err), {
              duration: 5000,
              position: "bottom-center",
            })
          },
        }
      )
    }
  }, [isTimerDetailDataLoading])

  // function of add time log call+
  const timeLogCall = (jobId: any, stopReasons: any) => {
    addTimerLogs({
      timerId,
      machineId: timerDetailData?.item?.machineId._id as string,
      machineClassId: timerDetailData?.item?.machineClassId._id as string,
      locationId: timerDetailData?.item?.locationId._id as string,
      factoryId: timerDetailData?.item?.factoryId._id as string,
      jobId: jobId,
      partId: timerDetailData?.item?.partId._id as string,
      time: cycleClockInSeconds,
      operator: (timerDetailData?.item?.operator?._id as string) || null,
      operatorName: timerDetailData?.item?.operator?.firstName as string,
      status:
        (timerDetailData?.item?.partId.time as number) > cycleClockInSeconds
          ? "Gain"
          : "Loss",
      stopReason: stopReasons,
      cycle: (timerLogsCount?.item?.count as number) + 1,
    })
  }

  // function of stop cycle interval
  const stopInterval = () => {
    clearInterval(intervalRef.current)
  }

  const stopCounter = () => {
    endCycleTimer(timerId, {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          stopInterval()
          setProgress(0)
          setCycleClockInSeconds(0)
          setIsCycleClockRunning(false)
          startingTimerReadings([
            `${currentDate} - Stopping timer`,
            `${currentDate} - Timer stopped`,
          ])
        } else {
          toast.error(String(data.message), {
            duration: 5000,
            position: "bottom-center",
          })
        }
      },
      onError: (err: any) => {
        toast.error(String(err), { duration: 5000, position: "bottom-center" })
      },
    })
    endCycleTimer(timerId)
  }

  const [isEndedProductionTime, setIsEndedProductionTime] =
    useState<boolean>(true)

  if (isTimerDetailDataLoading || isTimerJobsLoading || isCycleTimerLoading) {
    return (
      <div
        className="absolute z-50 text-blue-700 animate-spin top-3 left-3"
        role="status"
        aria-label="loading"
      >
        <FaCircleNotch size={24} />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col justify-between w-full h-full overflow-hidden 2xl:text-lg dark:bg-dark-blue dark:text-white">
      <Header
        progress={progress}
        isLoading={isTimerDetailDataLoading}
        location={timerDetailData?.item?.locationId.name}
        setOpenTimerLogs={setIsTimerLogsModalOpen}
      />
      <div className="relative grid flex-1 grid-cols-1 px-4 md:grid-cols-2 md:px-12 mt-7 dark:text-white">
        <Details
          timerDetails={timerDetailData?.item}
          isTimerDetailDataLoading={isTimerDetailDataLoading}
          readingMessages={readingMessages}
          sectionDiv={sectionDiv}
          jobUpdateId={getJobsId()}
          defaultOperator={defaultOperator}
          jobTimer={jobTimer?.item as T_JobTimer}
          isJobTimerLoading={isJobTimerLoading}
          isCycleClockRunning={isCycleClockRunning}
          timerJobs={timerJobs?.items}
          isTimerJobsLoading={isTimerJobsLoading}
          isJobSwitch={isJobSwitch}
          setIsJobSwitch={setIsJobSwitch}
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

        <Footer
          progress={progress}
          isLoading={isTimerDetailDataLoading}
          timeZone={timerDetailData?.item?.locationId.timeZone}
        />
        <div className="absolute bottom-0 w-full slides">
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
            endTimer={setEndTimer}
            setIsEndProductionModalOpen={setIsEndProductionModalOpen}
          />
        </div>
        {/* {isEndedProductionTime && (
          <div className="absolute left-0 z-50 flex flex-col items-center justify-center w-full h-full pb-24 top-20 bg-black/80 backdrop-blur-sm">
            <div className="mb-10 text-6xl font-semibold text-white uppercase">
              OFFLINE
            </div>

            {[
              USER_ROLES.Super,
              USER_ROLES.Administrator,
              USER_ROLES.Production,
            ].includes(userProfile?.item.role ?? "") && (
              <Button
                variant="contained"
                className="text-normal"
                onClick={() => {
                  setIsEndedProductionTime(false)
                }}
              >
                RESET
                <span className="ml-4 font-bold">
                  {timerDetailData?.item?.machineId?.name}
                </span>
              </Button>
            )}
          </div>
        )} */}
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
      <TimerLogsModal
        isOpen={isTimerLogsModalOpen}
        setIsOpen={setIsTimerLogsModalOpen}
        timerlogs={timerLogsData?.items}
      />
    </div>
  )
}

export default Controller
