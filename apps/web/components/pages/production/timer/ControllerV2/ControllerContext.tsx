import { PropsWithChildren, createContext, useRef, useState } from "react"
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
import { T_ControllerTimer, T_CycleTimer } from "custom-validator"
import useGetCycleTimer from "../../../../../hooks/timers/useGetCycleTimer"
import useAddCycleTimer from "../../../../../hooks/timers/useAddCycleTimer"
import useEndAddCycleTimer from "../../../../../hooks/timers/useEndAddCycleTimer"
import useEndCycleTimer from "../../../../../hooks/timers/useEndCycleTimer"

export interface ControllerDetailData {
  factoryName: string
  machineName: string
  partName: string
  averageTime: number
  weight: number
}

export interface ControllerContextProps {
  controllerDetailData: Partial<ControllerDetailData>
  operator: any
  cycleClockSeconds: number
  controllerClockSeconds: number
  isCycleClockRunning: boolean
  unitCreated: number
  timerId: string | undefined
  hasControllerTimer: boolean
  stopReasons: any[]
  onToggleStart: () => void
  setStopReasons: (...args: any) => void
  onStopCycleWithReasons: (...args: any) => void
}

export const ControllerContext = createContext<ControllerContextProps>({
  controllerDetailData: {},
  operator: {},
  cycleClockSeconds: 0,
  controllerClockSeconds: 0,
  unitCreated: 0,
  timerId: undefined,
  stopReasons: [],
  hasControllerTimer: false,
  isCycleClockRunning: false,
  onToggleStart: () => {},
  setStopReasons: () => {},
  onStopCycleWithReasons: () => {},
})

type ControllerProviderProps = PropsWithChildren & {
  controllerDetailData: ControllerDetailData
  operator: any
  cycleClockSeconds: number
  timerId: string
}

export const ControllerContextProvider = ({
  children,
  controllerDetailData,
  operator,
  cycleClockSeconds: initialCycleClockSeconds,
  timerId,
}: ControllerProviderProps) => {
  const { data: profileData } = useProfile()
  const operatorId = getObjectId(operator)
  const currentOperator = operatorId ? operator : profileData?.item
  const { data: controllerTimerData, isLoading: controllerTimerDataLoading } =
    useGetControllerTimer(timerId)
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const defaultStopReasons = ["Unit Created"]
  const [stopReasons, setStopReasons] = useState([])
  const {
    data: cycleTimerData,
    refetch: cycleRefetch,
    isLoading: isCycleTimerLoading,
  } = useGetCycleTimer(timerId)
  const { mutate: addControllerTimer } = useAddControllerTimer()
  const { mutate: addCycleTimer } = useAddCycleTimer()
  const { mutate: endAddCycleTimer } = useEndAddCycleTimer()
  const { mutate: endCycleTimer } = useEndCycleTimer()
  const [controllerClockSeconds, setControllerClockSeconds] = useState(0)
  const [cycleClockSeconds, setCycleClockSeconds] = useState(
    initialCycleClockSeconds
  )
  const [isControllerClockRunning, setIsControllerClockRunning] =
    useState(false)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [unitCreated, setUnitCreated] = useState(0)

  const controllerClockIntervalRef = useRef<any>()
  const cycleClockIntervalRef = useRef<any>()
  const hasControllerTimer =
    Array.isArray(controllerTimerData?.items) &&
    controllerTimerData!.items.length > 0

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
      setControllerClockSeconds((prev) => prev + 1)
    }, 1000)
  }

  const startCycleClockInterval = () => {
    stopCycleClockInterval()
    setIsCycleClockRunning(true)
    cycleClockIntervalRef.current = setInterval(() => {
      setCycleClockSeconds((prev) => prev + 0.1)
    }, 100)
  }

  const onStopCycle = () => {
    startCycleClockInterval()
    if (!hasControllerTimer) {
      const controllerTimerValue: T_ControllerTimer = {
        timerId: timerId,
        locationId: getObjectId(timerDetailData?.item?.locationId),
      }
      addControllerTimer(controllerTimerValue)
    }

    endAddCycleTimer(timerId)
  }

  const onStopCycleWithReasons = () => {
    stopCycleClockInterval()
    endCycleTimer(timerId)
    setIsCycleClockRunning(false)
    setCycleClockSeconds(0)
  }

  const onStartCycle = () => {
    setCycleClockSeconds(0)
    setUnitCreated((c) => c + 1)
  }

  const onToggleStart = () => {
    const cycleTimerValue: T_CycleTimer = {
      timerId,
    }
    if (!isControllerClockRunning) {
      startControllerClockInterval()
      addCycleTimer(cycleTimerValue)
    }
    if (!isCycleClockRunning) {
      onStopCycle()
    } else {
      onStartCycle()
    }
  }

  return (
    <ControllerContext.Provider
      value={{
        controllerDetailData,
        operator: currentOperator,
        cycleClockSeconds,
        hasControllerTimer,
        isCycleClockRunning,
        controllerClockSeconds,
        timerId,
        unitCreated,
        setStopReasons,
        onToggleStart,
        onStopCycleWithReasons,
        stopReasons,
      }}
    >
      {children}
    </ControllerContext.Provider>
  )
}
