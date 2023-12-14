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
  T_TimerStopReason,
} from "custom-validator"
import useGetCycleTimer from "../../../../../hooks/timers/useGetCycleTimer"
import useAddCycleTimer from "../../../../../hooks/timers/useAddCycleTimer"
import useEndAddCycleTimer from "../../../../../hooks/timers/useEndAddCycleTimer"
import useEndCycleTimer from "../../../../../hooks/timers/useEndCycleTimer"
import { getSecondsDifferent } from "../../../../../helpers/date"
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
  controllerJob: any
  isControllerJobLoading: boolean
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
  onOperatorChange: (operatorId: string) => void
}

export const ControllerContext = createContext<ControllerContextProps>({
  variant: "idle",
  progress: undefined,
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
  isControllerJobLoading: false,
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
  const currentOperator = operatorId ? operator : profileData?.item
  const { data: controllerTimerData, isLoading: controllerTimerDataLoading } =
    useGetControllerTimer(timerId)
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
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

  const { mutate: endControllerTimer } = useEndControllerTimer()
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
  const { mutate: addControllerTimer } = useAddControllerTimer()
  const { mutate: addCycleTimer } = useAddCycleTimer()
  const { mutate: endAddCycleTimer } = useEndAddCycleTimer()
  const { mutate: endCycleTimer } = useEndCycleTimer()
  const { mutate: assignJobToTimer } = useAssignJobToTimer()
  const { mutate: updateTimerOperator } = useUpdateTimer()
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
  const socket = useSocket((state) => state.instance)
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

  const productionTime = () => {}

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
            div.scrollTop = 999999999999999999999
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
    stopControllerClockInterval()
    stopCycleClockInterval()
    setClockSeconds(0)
    setClockMilliSeconds(0)
    setIsControllerClockRunning(false)
    setIsCycleClockRunning(false)
    endControllerTimer(timerId)

    if (onEndProductionProps) {
      onEndProductionProps(unitCreated)
    }
    if (socket) {
      socket.emit(`end-production-pressed`, {
        timerId,
        action: "end-production-pressed",
      })
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
    timeLogCall(getObjectId(jobTimer?.item))
    setClockMilliSeconds(0)
    if (socket) {
      socket.emit(`stop-press`, {
        timerId,
        action: "stop-press",
        currentUnit: unitCreated + 1,
      })
    }
    setUnitCreated((c) => {
      return c + 1
    })
    startCycleClockInterval()
    if (!hasControllerTimer) {
      const controllerTimerValue: T_ControllerTimer = {
        timerId: timerId,
        locationId: getObjectId(timerDetailData?.item?.locationId),
      }
      addControllerTimer(controllerTimerValue)
    }
    endAddCycleTimer(timerId)
    // TODO:/JAMES should confirm its context
    addReadingMessage("Stopping Timer")
    addReadingMessage("Timer stopped")
    addReadingMessage("Timer cycle reset")
    addReadingMessage("Timer One unit created")
    setIsStopDisabled(true)
    setTimeout(() => {
      setIsStopDisabled(false)
    }, 5000)
    if (onStopCycleProps) {
      onStopCycleProps(unitCreated)
    }
  }

  const onStopCycleWithReasons = () => {
    timeLogCall(getObjectId(jobTimer?.item))
    stopCycleClockInterval()
    setIsCycleClockRunning(false)
    setStopReasons([])
    setClockMilliSeconds(0)
    endCycleTimer(timerId)
    setIsStopDisabled(false)
    if (onStopCycleWithReasonsProps) {
      onStopCycleWithReasonsProps(unitCreated)
    }
    if (socket) {
      socket.emit(`end-controller-pressed`, {
        timerId,
        action: "end-controller-pressed",
      })
    }
  }

  const onStartCycle = () => {
    if (socket) {
      socket.emit(`start-press`, {
        timerId,
        action: "start-press",
      })
    }
    setClockMilliSeconds(0)
    startCycleClockInterval()
    setIsCycleClockRunning(true)
    // TODO:/JAMES should confirm its context
    addReadingMessage("StartingTimer")
    addReadingMessage("Timer started")
  }

  const onToggleStart = () => {
    const cycleTimerValue: T_CycleTimer = {
      timerId,
    }
    if (!isControllerClockRunning) {
      // Job & operator validation
      if (!getObjectId(jobTimer?.item)) {
        toast.error("Cannot start a controller without job assigned")
        console.error("job timer is", jobTimer)
        return
      }
      if (!getObjectId(operator)) {
        toast.error("Cannot start a controller without operator assigned")
        return
      }
      if (socket) {
        socket.emit(`start-press`, {
          timerId,
          action: "start-press",
        })
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

  const onOperatorChange = (operator: string) => {
    // setIsChangingJob(true)
    updateTimerOperator(
      { ...timerDetailData?.item, operator },
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
  const timeLogCall = (jobId: any) => {
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
    addTimerLog({
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
    })
  }

  useEffect(() => {
    if (timerDetailData?.item?.createdAt) {
      const hours = new Date(
        controllerTimerData?.items[0]?.createdAt as Date
      ).getHours()
      setTotals((current) => ({
        ...current,
        totalTons: unitCreated * controllerDetailData.weight,
        unitsPerHour: unitCreated / hours,
        tonsPerHour: (unitCreated * controllerDetailData.weight) / hours,
      }))
    }
  }, [unitCreated])

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

  return (
    <ControllerContext.Provider
      value={{
        variant,
        progress,
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
        readingMessages,
        setReadingMessages,
        addReadingMessage,
      }}
    >
      {children}
    </ControllerContext.Provider>
  )
}
