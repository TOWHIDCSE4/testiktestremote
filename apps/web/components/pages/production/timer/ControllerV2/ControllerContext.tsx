import {
  PropsWithChildren,
  RefObject,
  createContext,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import useGetUser from "../../../../../hooks/users/useGetUser"
import useSession from "../../../../../hooks/users/useSession"
import useProfile from "../../../../../hooks/users/useProfile"
import { getObjectId } from "../../../../../helpers/ids"
import useGetControllerTimer from "../../../../../hooks/timers/useGetControllerTimer"
import {
  hourMinuteSecond,
  hourMinuteSecondMilli,
} from "../../../../../helpers/timeConverter"
import useAddControllerTimer from "../../../../../hooks/timers/useAddControllerTimer"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import {
  T_BackendResponse,
  T_ControllerTimer,
  T_CycleTimer,
  T_JobTimer,
  T_TimerLog,
  T_TimerStopReason,
} from "custom-validator"
import useGetCycleTimer from "../../../../../hooks/timers/useGetCycleTimer"
import useAddCycleTimer from "../../../../../hooks/timers/useAddCycleTimer"
import useEndAddCycleTimer from "../../../../../hooks/timers/useEndAddCycleTimer"
import useEndCycleTimer from "../../../../../hooks/timers/useEndCycleTimer"
import useGetTimerJobs from "../../../../../hooks/timers/useGetTimerJobs"
import { set } from "lodash"
import { useQueryClient } from "@tanstack/react-query"
import useGetJobTimerByTimerId from "../../../../../hooks/jobTimer/useGetJobTimerByTimerId"
import useAddTimerLog from "../../../../../hooks/timerLogs/useAddTimerLog"
import useGetAllTimerLogsCount from "../../../../../hooks/timerLogs/useGetAllTimerLogsCount"
import useEndControllerTimer from "../../../../../hooks/timers/useEndControllerTimer"
import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"
import dayjs from "dayjs"
import useAssignJobToTimer from "../../../../../hooks/timers/useAssignJobToTimer"
import toast from "react-hot-toast"
import useUpdateJobTimer from "../../../../../hooks/jobTimer/useUpdateJobTimer"
import useUpdateTimer from "../../../../../hooks/timers/useUpdateTimer"
import { useSocket } from "../../../../../store/useSocket"
import { getHoursDifferent } from "../../../../../helpers/date"

export interface ControllerDetailData {
  factoryName: string
  machineName: string
  partName: string
  averageTime: number
  locationName: string
  weight: number
}

export interface ControllerContextProps {
  variant: "idle" | "active" | "danger"
  progress: number | undefined
  isStopMenuOpen: boolean
  setIsStopMenuOpen: (val: boolean) => void
  controllerDetailData: Partial<ControllerDetailData>
  operator: any
  cycleClockSeconds: number
  controllerClockSeconds: number
  isCycleClockRunning: boolean
  unitCreated: number
  timerId: string | undefined
  isStopDisabled: boolean
  hasControllerTimer: boolean
  stopReasons: any[]
  isChangingOperator: boolean
  controllerJob: any
  isControllerJobLoading: boolean
  isStartControllerError: boolean
  isProductionEnded: boolean
  timerLogs: any
  jobs: any[]
  isJobsLoading: boolean
  isChangingJob: boolean
  totals: {
    unitsPerHour: number
    tonsPerHour: number
    totalTons: number
  }
  onToggleStart: () => void
  setStopReasons: (...args: any) => void
  onStopCycleWithReasons: (...args: any) => void
  onEndProduction: () => void
  readingsDivRef?: RefObject<HTMLDivElement>
  setReadingsDivRef: (ref: RefObject<HTMLDivElement>) => void
  readingMessages?: Array<string>
  setReadingMessages: (messages?: Array<string>) => void
  addReadingMessage: (message: string) => void
  onJobChange: (jobId: string) => void
  onOperatorChange: (operatorId: string, operatorName: string) => void
  startNewControllerSession: () => void
}

export const ControllerContext = createContext<ControllerContextProps>({
  variant: "idle",
  progress: undefined,
  isStopMenuOpen: false,
  setIsStopMenuOpen: (val) => {},
  controllerDetailData: {},
  operator: {},
  cycleClockSeconds: 0,
  controllerClockSeconds: 0,
  unitCreated: 0,
  timerId: undefined,
  stopReasons: [],
  timerLogs: [],
  jobs: [],
  isJobsLoading: false,
  isChangingJob: false,
  isChangingOperator: false,
  isControllerJobLoading: false,
  isStartControllerError: false,
  isProductionEnded: false,
  isStopDisabled: false,
  totals: {
    unitsPerHour: 0,
    tonsPerHour: 0,
    totalTons: 0,
  },
  controllerJob: {},
  hasControllerTimer: false,
  isCycleClockRunning: false,
  onToggleStart: () => {},
  setStopReasons: () => {},
  onStopCycleWithReasons: () => {},
  onEndProduction: () => {},
  readingsDivRef: undefined,
  setReadingsDivRef: (div) => {},
  readingMessages: undefined,
  setReadingMessages(messages) {},
  addReadingMessage(message) {},
  onJobChange: () => {},
  onOperatorChange: () => {},
  startNewControllerSession: () => {},
})

type ControllerProviderProps = PropsWithChildren & {
  controllerDetailData: ControllerDetailData
  operator: any
  timerId: string
  isControllerModalOpen: boolean
  initialCycleClockSeconds: number
  initialUnitCreated: number
  onStopCycle: (unit: number) => void
  onStopCycleWithReasons: (unit: number) => void
  onEndProduction: (unit: number) => void
  onControllerModalClosed: (unit: number, seconds: number) => void
}

export const ControllerContextProvider = ({
  children,
  controllerDetailData,
  operator,
  timerId,
  initialCycleClockSeconds,
  isControllerModalOpen,
  initialUnitCreated,
  onStopCycle: onStopCycleProps,
  onStopCycleWithReasons: onStopCycleWithReasonsProps,
  onEndProduction: onEndProductionProps,
  onControllerModalClosed,
}: ControllerProviderProps) => {
  const { data: profileData } = useProfile()
  const operatorId = getObjectId(operator)
  const { data: controllerTimerData, isLoading: controllerTimerDataLoading } =
    useGetControllerTimer(timerId)
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const currentOperator = timerDetailData?.item?.operator ?? profileData?.item
  const { mutate: addTimerLog } = useAddTimerLog()
  const {
    data: timerJobs,
    isLoading: isTimerJobsLoading,
    refetch: timerJobsRefetch,
  } = useGetTimerJobs(
    getObjectId(timerDetailData?.item?.locationId),
    getObjectId(timerDetailData?.item?.factoryId),
    getObjectId(timerDetailData?.item?.partId)
  )
  const { data: jobTimer, isLoading: isControllerJobLoading } =
    useGetJobTimerByTimerId({
      locationId: timerDetailData?.item?.locationId._id,
      timerId,
    })

  const { mutate: endControllerTimer, isLoading: isEndingProduction } =
    useEndControllerTimer()
  // const { data: timerLogsCount, refetch: refetchTimerLogs } =
  //   useGetAllTimerLogsCount({
  //     locationId: timerDetailData?.item?.locationId._id,
  //     timerId,
  //   })

  const { data: timerLogsData } = useGetAllTimerLogs({
    locationId: timerDetailData?.item?.locationId._id,
    timerId,
  })

  const defaultStopReasons = ["Unit Created"]
  const [stopReasons, setStopReasons] = useState<T_TimerStopReason[]>([])
  const {
    data: cycleTimerData,
    refetch: cycleRefetch,
    isLoading: isCycleTimerLoading,
  } = useGetCycleTimer(timerId)
  const { mutate: addControllerTimer, isError: isStartControllerError } =
    useAddControllerTimer()
  const { mutate: addCycleTimer } = useAddCycleTimer()
  const { mutate: endAddCycleTimer } = useEndAddCycleTimer()
  const { mutate: endCycleTimer } = useEndCycleTimer()
  const { mutate: assignJobToTimer } = useAssignJobToTimer()
  const { mutate: updateTimerOperator, isLoading: isChangingOperator } =
    useUpdateTimer()
  const { mutate: updateJobTimer, isLoading: isChangingJob } =
    useUpdateJobTimer()

  const [clockSeconds, setClockSeconds] = useState(0)
  const [clockMilliSeconds, setClockMilliSeconds] = useState(0)
  const [isControllerClockRunning, setIsControllerClockRunning] =
    useState(false)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [unitCreated, setUnitCreated] = useState(0)
  const [isStopDisabled, setIsStopDisabled] = useState(false)
  const [totals, setTotals] = useState({
    unitsPerHour: 0,
    tonsPerHour: 0,
    totalTons: 0,
  })
  // const socket = useSocket((state) => state.instance)
  // setTotals({
  //   unitsPerHour: count / Math.round(hoursLapse),
  //   tonsPerHour:
  //     (count * (timerDetailData?.item?.partId.tons as number)) /
  //     Math.round(hoursLapse),
  //   totalTons: count * (timerDetailData?.item?.partId.tons as number),
  // })

  const queryClient = useQueryClient()

  const controllerClockIntervalRef = useRef<any>()
  const cycleClockIntervalRef = useRef<any>()
  const isControllerModalOpenRef = useRef<any>()
  const hasControllerTimer =
    Array.isArray(controllerTimerData?.items) &&
    controllerTimerData!.items.length > 0

  const isProductionEnded =
    hasControllerTimer && !!controllerTimerData?.items[0]?.endAt

  const [readingsDivRef, setReadingsDivRefState] =
    useState<RefObject<HTMLDivElement>>()
  const setReadingsDivRef = useCallback(
    (ref: RefObject<HTMLDivElement>) => {
      setReadingsDivRefState(ref)
    },
    [setReadingsDivRefState]
  )

  const [readingMessages, setReadingMessages] = useState<Array<string>>()
  const addReadingMessage = useCallback(
    (message: string) => {
      const currentTime = dayjs
        .tz(dayjs(), timerDetailData?.item?.locationId.timezone ?? "")
        .format("YYYY-MM-DD HH:mm:ss")
      setReadingMessages((prev) => [
        ...(prev ?? []),
        `${currentTime} : ${message}`,
      ])
      if (readingsDivRef?.current) {
        const div = readingsDivRef.current
        setTimeout(
          (div) => {
            div.scrollTop = 0
          },
          500,
          div
        )
      }
    },
    [timerDetailData?.item?.locationId.timezone, readingsDivRef]
  )

  /* Check required data */
  if (!controllerTimerData && !controllerTimerDataLoading) {
    console.error("ControllerContext ControllerTimerData missing")
  }
  if (!currentOperator) {
    console.error("ControllerContext Operator Missing")
  }
  if (!timerDetailData && !isTimerDetailDataLoading) {
    console.error("ControllerContext Controller missing timer detail data ")
  }
  if (!cycleTimerData && !isCycleTimerLoading) {
    console.error("ControllerContext Controller missing cycle timer")
  }
  /* end of check */

  const onEndProduction = () => {
    resetControllerState()
    queryClient.setQueriesData(["controller-timer", timerId], (query: any) => {
      if (!query?.items?.length) return query
      return set(query, "items.0.endAt", new Date())
    })
    endControllerTimer(timerId, {
      onSettled: () => {
        queryClient.invalidateQueries(["controller-timer", timerId])
      },
    })

    if (onEndProductionProps) {
      onEndProductionProps(unitCreated)
    }
  }

  const stopControllerClockInterval = () => {
    clearInterval(controllerClockIntervalRef.current)
    setIsControllerClockRunning(false)
  }
  const stopCycleClockInterval = () => {
    clearInterval(cycleClockIntervalRef.current)
    setIsCycleClockRunning(false)
  }
  const startControllerClockInterval = () => {
    stopControllerClockInterval()
    setIsControllerClockRunning(true)
    controllerClockIntervalRef.current = setInterval(() => {
      setClockSeconds((prev) => {
        return prev + 1
      })
    }, 1000)
  }

  const startCycleClockInterval = () => {
    stopCycleClockInterval()
    setIsCycleClockRunning(true)
    cycleClockIntervalRef.current = setInterval(() => {
      setClockMilliSeconds((prev) => {
        return prev + 0.1
      })
    }, 100)
  }

  const onStopCycle = () => {
    if (isStopDisabled) {
      return
    }
    timeLogCall(jobTimer?.item?.jobId)
    setClockMilliSeconds(0)

    setUnitCreated((c) => {
      return c + 1
    })
    startCycleClockInterval()

    endAddCycleTimer(timerId)
    // TODO:/JAMES should confirm its context
    addReadingMessage("Stopping Timer")
    addReadingMessage("Timer stopped")
    addReadingMessage("Timer cycle reset")
    addReadingMessage("Timer One unit created")

    if (onStopCycleProps) {
      onStopCycleProps(unitCreated)
    }
  }

  const onStopCycleWithReasons = () => {
    timeLogCall(jobTimer?.item?.jobId)
    stopCycleClockInterval()
    setIsCycleClockRunning(false)
    setStopReasons([])
    setClockMilliSeconds(0)
    endCycleTimer(timerId)
    setIsStopDisabled(false)
    if (onStopCycleWithReasonsProps) {
      onStopCycleWithReasonsProps(unitCreated)
    }
    // if (socket) {
    //   socket.emit(`end-controller-pressed`, {
    //     timerId,
    //     action: "end-controller-pressed",
    //   })
    // }
  }

  const resetControllerState = () => {
    stopControllerClockInterval()
    stopCycleClockInterval()
    setIsControllerClockRunning(false)
    setIsCycleClockRunning(false)
    setClockMilliSeconds(0)
    setClockSeconds(0)
    setUnitCreated(0)
    setTotals({
      tonsPerHour: 0,
      unitsPerHour: 0,
      totalTons: 0,
    })
  }

  const onStartCycle = () => {
    setClockMilliSeconds(0)
    startCycleClockInterval()
    setIsCycleClockRunning(true)
    // TODO:/JAMES should confirm its context
    addReadingMessage("StartingTimer")
    addReadingMessage("Timer started")
    if (!hasControllerTimer) {
      const controllerTimerValue: T_ControllerTimer = {
        timerId: timerId,
        locationId: getObjectId(timerDetailData?.item?.locationId),
      }
      queryClient.setQueriesData(
        ["in-production", getObjectId(timerDetailData?.item?.locationId)],
        (query: any) => {
          return {
            ...query,
            item: {
              started: true,
              seconds: 1,
              createdAt: new Date(),
            },
          }
        }
      )
      addControllerTimer(controllerTimerValue, {
        onSuccess: () => {
          queryClient.invalidateQueries(["controller-timer", timerId])
        },
        onError: () => {
          resetControllerState()
        },
      })
    }
  }

  const startNewControllerSession = () => {
    const controllerTimerValue = {
      timerId: timerId,
      locationId: getObjectId(timerDetailData?.item?.locationId),
      newSession: true,
    }
    queryClient.setQueriesData(
      ["timer-logs-count", timerDetailData?.item?.locationId._id, timerId],
      (query: any) => {
        if (query && typeof query?.item?.count === "number") {
          const increasedCount = set(query, ["item", "count"], 0)
          const increasedItemCount = set(increasedCount, ["itemCount"], 0)
          return increasedItemCount
        }
        return query
      }
    )
    queryClient.setQueriesData(
      ["timer-logs", timerDetailData?.item?.locationId._id, timerId],
      (query: any) => {
        if (query?.items) {
          query.items = []
          query.itemCount = 0
        }
        return query
      }
    )
    setUnitCreated(0)
    addControllerTimer(controllerTimerValue, {
      onSuccess: () => {
        queryClient.invalidateQueries(["controller-timer", timerId])
        queryClient.invalidateQueries([
          "timer-logs-count",
          timerDetailData?.item?.locationId._id,
          timerId,
        ])
        queryClient.invalidateQueries([
          "timer-logs",
          timerDetailData?.item?.locationId._id,
          timerId,
        ])
      },
    })
  }

  const validateAbleToStart = () => {
    if (!getObjectId(jobTimer?.item)) {
      toast.error("Cannot start a controller without job assigned")
      return false
    }
    if (!operator?.firstName) {
      toast.error("Cannot start a controller without operator assigned")
      return false
    }
    if (isTimerDetailDataLoading) {
      toast.error("Please wait controller still loading data")
      return false
    }
    if (isChangingOperator) {
      toast.error("Cannot start controller while changing operator")
      return false
    }
    if (isProductionEnded) {
      toast.error("Production is ended !")
      return false
    }
    if (isStartControllerError) {
      toast.error("There is error when starting the controller")
      return false
    }
    if (isEndingProduction) {
      toast.error("Currently in process of ending production")
      return false
    }
    return true
  }

  const onToggleStart = () => {
    const cycleTimerValue: T_CycleTimer = {
      timerId,
    }
    setIsStopDisabled(true)
    setTimeout(() => {
      setIsStopDisabled(false)
    }, 5000)
    if (!isControllerClockRunning) {
      if (!validateAbleToStart()) {
        return
      }
      startControllerClockInterval()
      addCycleTimer(cycleTimerValue)
    }
    if (isCycleClockRunning) {
      onStopCycle()
    } else {
      onStartCycle()
    }
  }

  const onJobChange = (job: any) => {
    const updatedJobTimer: T_JobTimer = {
      _id: getObjectId(jobTimer?.item),
      jobId: getObjectId(job),
      timerId,
    }
    updateJobTimer(updatedJobTimer, {
      onError: (err: any) => {
        toast.error(err?.message)
      },
      onSuccess: (res) => {
        if (res.error) {
          toast.error(res.message)
          return
        }
        toast.success("Success changing job for the controller")
      },
      onSettled: () => {
        queryClient.invalidateQueries([
          "job-timer-timer",
          getObjectId(timerDetailData?.item?.locationId),
          timerId,
        ])
      },
    })
  }

  const onOperatorChange = (operator: string, operatorName: string) => {
    // setIsChangingJob(true)
    queryClient.setQueriesData(["timer", timerId], (query: any) => {
      return set(query, "item", {
        ...timerDetailData?.item,
        operator: operatorName ? "" : operator,
        operatorName: operatorName ? operatorName : "",
      })
    })
    updateTimerOperator(
      {
        ...timerDetailData?.item,
        operator: operatorName ? "" : operator,
        operatorName: operatorName ? operatorName : "",
      },
      {
        onError: (e) => {
          console.log(
            "🚀 ~ file: ControllerContext.tsx:409 ~ onOperatorChange ~ e:",
            e
          )
          toast.error(
            "Error while trying to change operator for this controller"
          )
        },
        onSuccess: () => {
          toast.success("Operator updated")
        },
        onSettled: () => {
          // setIsChangingJob(false)
          queryClient.invalidateQueries(["timer", timerId])
          if (operatorName) queryClient.invalidateQueries(["users"])
        },
      }
    )
  }

  useEffect(() => {
    if (timerDetailData) {
      assignJobToTimer(
        {
          timerId,
          partId: timerDetailData?.item?.partId._id as string,
          factoryId: timerDetailData?.item?.factoryId._id as string,
          locationId: timerDetailData?.item?.locationId._id as string,
          status: "Active",
        },
        {
          onSuccess: (res) => {
            if (isControllerModalOpen) {
              if (res.error) {
                toast.error(res.message)
                return
              }
              toast.success("Successfully assigning job to controller")
            }
          },
          onError: (err: any) => {
            if (isControllerModalOpen) {
              toast.error(err.message)
            }
          },
        }
      )
    }
  }, [timerDetailData])
  // function of add time log call+
  const timeLogCall = (
    jobId: any,
    byPassLocal: boolean = false,
    attempt: number = 0
  ) => {
    if (attempt > 5) return
    if (!byPassLocal) {
      if (!stopReasons.length) {
        queryClient.setQueriesData(
          ["timer-logs-count", timerDetailData?.item?.locationId._id, timerId],
          (query: any) => {
            if (query && typeof query?.item?.count === "number") {
              const current = query?.item?.count

              const increasedCount = set(query, ["item", "count"], current + 1)
              const increasedItemCount = set(
                increasedCount,
                ["itemCount"],
                current + 1
              )
              return increasedItemCount
            }
            return query
          }
        )
      }
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
            jobId: jobId,
            partId: timerDetailData?.item?.partId,
            time: clockMilliSeconds,
            operator: timerDetailData?.item?.operator || null,
            operatorName: timerDetailData?.item?.operator?.firstName as string,
            status:
              (timerDetailData?.item?.partId.time as number) > clockMilliSeconds
                ? "Gain"
                : "Loss",
            stopReason: stopReasons.length
              ? stopReasons
              : (defaultStopReasons as T_TimerStopReason[]),
            cycle: unitCreated + 1,
          }
          if (query?.items) {
            query.items.unshift(newData)
            query.itemCount += 1
          }
          return query
        }
      )
    }

    const savedLog: T_TimerLog = {
      timerId,
      machineId: timerDetailData?.item?.machineId._id as string,
      machineClassId: timerDetailData?.item?.machineClassId._id as string,
      locationId: timerDetailData?.item?.locationId._id as string,
      factoryId: timerDetailData?.item?.factoryId._id as string,
      jobId: jobId,
      partId: timerDetailData?.item?.partId._id as string,
      time: clockMilliSeconds,
      operator: (timerDetailData?.item?.operator?._id as string) || null,
      operatorName: timerDetailData?.item?.operator?.firstName as string,
      status:
        (timerDetailData?.item?.partId.time as number) > clockMilliSeconds
          ? "Gain"
          : "Loss",
      stopReason: stopReasons.length
        ? stopReasons
        : (defaultStopReasons as T_TimerStopReason[]),
      cycle: unitCreated + 1,
    }
    addTimerLog(savedLog, {
      onSuccess: () => {},
      onError: () => {
        timeLogCall(jobId, true, attempt + 1)
      },
    })
  }

  useEffect(() => {
    if (
      timerDetailData?.item?.createdAt &&
      controllerTimerData?.items[0]?.createdAt
    ) {
      const hours = getHoursDifferent(controllerTimerData?.items[0]?.createdAt)
      setTotals((current) => ({
        ...current,
        totalTons: unitCreated * controllerDetailData.weight,
        unitsPerHour: hours > 1 ? unitCreated / hours : unitCreated,
        tonsPerHour:
          hours > 1
            ? (unitCreated * controllerDetailData.weight) / hours
            : unitCreated * controllerDetailData.weight,
      }))
    }
  }, [
    unitCreated,
    timerDetailData?.item?.createdAt,
    controllerTimerData?.items[0]?.createdAt,
  ])

  useEffect(() => {
    // on open
    if (
      !isControllerModalOpenRef.current &&
      isControllerModalOpen &&
      initialCycleClockSeconds > 0
    ) {
      setClockMilliSeconds(initialCycleClockSeconds)
      if (!isCycleClockRunning) {
        startCycleClockInterval()
        setIsCycleClockRunning(true)
      }
    }
    if (
      !isControllerModalOpenRef.current &&
      isControllerModalOpen &&
      initialUnitCreated
    ) {
      setUnitCreated(initialUnitCreated)
    }

    // on close
    if (isControllerModalOpenRef.current && !isControllerModalOpen) {
      onControllerModalClosed(unitCreated, clockMilliSeconds)
    }
    isControllerModalOpenRef.current = isControllerModalOpen
  }, [
    initialCycleClockSeconds,
    initialUnitCreated,
    isControllerModalOpen,
    isCycleClockRunning,
    startCycleClockInterval,
  ])

  const [variant, setVariant] =
    useState<ControllerContextProps["variant"]>("idle")

  const [progress, setProgress] = useState<number>()

  useEffect(() => {
    if (clockMilliSeconds == 0) {
      setProgress(0)
    } else if (controllerDetailData.averageTime == 0) {
      setProgress(100)
    } else
      setProgress(
        Math.floor((clockMilliSeconds * 100) / controllerDetailData.averageTime)
      )
  }, [controllerDetailData.averageTime, clockMilliSeconds])

  // useEffect(() => {
  //   async function controllerTimerTick(
  //     eventName: string = "controller-timer-tick"
  //   ) {
  //     const data = {
  //       timerId,
  //       unitCreated,
  //       isCycleClockRunning,
  //       cycleClockSeconds: Math.trunc(clockMilliSeconds),
  //       detail: controllerDetailData,
  //       isControllerModalOpen: isControllerModalOpenRef.current,
  //     }
  //     socket?.emit(eventName, data)
  //   }
  //   if (isControllerModalOpenRef.current) {
  //     controllerTimerTick()
  //   }

  //   const subscriber = useSocket.subscribe(({ isConnected }) => {
  //     if (isConnected) {
  //       controllerTimerTick("controller-reconnect")
  //     }
  //   })
  //   return () => {
  //     subscriber()
  //   }
  // }, [
  //   socket,
  //   timerId,
  //   unitCreated,
  //   isCycleClockRunning,
  //   Math.trunc(clockMilliSeconds),
  // ])

  useEffect(() => {
    setVariant(
      !isCycleClockRunning
        ? "idle"
        : progress == undefined
        ? "danger"
        : progress >= 100
        ? "danger"
        : "active"
    )
  }, [progress, isCycleClockRunning])

  const [isStopMenuOpen, setIsStopMenuOpen] = useState<boolean>(false)

  return (
    <ControllerContext.Provider
      value={{
        variant,
        progress,
        isStopMenuOpen,
        isChangingOperator,
        setIsStopMenuOpen,
        controllerDetailData,
        operator: currentOperator,
        jobs: timerJobs?.items || [],
        isJobsLoading: isTimerJobsLoading,
        controllerJob: jobTimer?.item,
        isControllerJobLoading,
        onOperatorChange,
        onJobChange,
        isChangingJob,
        cycleClockSeconds: clockMilliSeconds,
        hasControllerTimer,
        isCycleClockRunning,
        controllerClockSeconds: clockSeconds,
        timerId,
        unitCreated,
        setStopReasons,
        onToggleStart,
        onStopCycleWithReasons,
        stopReasons,
        totals,
        isStopDisabled,
        onEndProduction,
        timerLogs: timerLogsData,
        readingsDivRef,
        setReadingsDivRef,
        startNewControllerSession,
        readingMessages,
        setReadingMessages,
        addReadingMessage,
        isProductionEnded,
        isStartControllerError,
      }}
    >
      {children}
    </ControllerContext.Provider>
  )
}
