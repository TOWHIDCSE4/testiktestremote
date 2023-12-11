import { PropsWithChildren, createContext } from "react"
import useGetUser from "../../../../../hooks/users/useGetUser"
import useSession from "../../../../../hooks/users/useSession"
import useProfile from "../../../../../hooks/users/useProfile"
import { getObjectId } from "../../../../../helpers/ids"
import useGetControllerTimer from "../../../../../hooks/timers/useGetControllerTimer"

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
  timerId: string | undefined
  hasControllerTimer: boolean
}

export const ControllerContext = createContext<ControllerContextProps>({
  controllerDetailData: {},
  operator: {},
  cycleClockSeconds: 0,
  timerId: undefined,
  hasControllerTimer: false,
})

type ControllerProviderProps = PropsWithChildren & {
  controllerDetailData: ControllerDetailData
  operator: any
  cycleClockSeconds: number
  timerId: string | undefined
}

export const ControllerContextProvider = ({
  children,
  controllerDetailData,
  operator,
  cycleClockSeconds,
  timerId,
}: ControllerProviderProps) => {
  const { data: profileData } = useProfile()
  const operatorId = getObjectId(operator)
  const currentOperator = operatorId ? operator : profileData?.item
  const { data: controllerTimerData } = useGetControllerTimer(timerId as string)
  if (!controllerTimerData) {
    console.error("ControllerContext ControllerTimerData missing")
  }
  if (!currentOperator) {
    console.error("ControllerContext Operator Missing")
  }
  const hasControllerTimer =
    Array.isArray(controllerTimerData?.items) &&
    controllerTimerData!.items.length > 0
  return (
    <ControllerContext.Provider
      value={{
        controllerDetailData,
        operator: currentOperator,
        cycleClockSeconds,
        hasControllerTimer,
        timerId,
      }}
    >
      {children}
    </ControllerContext.Provider>
  )
}
