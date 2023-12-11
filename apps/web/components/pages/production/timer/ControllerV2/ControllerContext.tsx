import { PropsWithChildren, createContext } from "react"
import useGetUser from "../../../../../hooks/users/useGetUser"
import useSession from "../../../../../hooks/users/useSession"
import useProfile from "../../../../../hooks/users/useProfile"
import { getObjectId } from "../../../../../helpers/ids"

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
}

export const ControllerContext = createContext<ControllerContextProps>({
  controllerDetailData: {},
  operator: {},
})

type ControllerProviderProps = PropsWithChildren & {
  controllerDetailData: ControllerDetailData
  operator: any
}

export const ControllerContextProvider = ({
  children,
  controllerDetailData,
  operator,
}: ControllerProviderProps) => {
  const { data: profileData } = useProfile()
  const operatorId = getObjectId(operator)
  const currentOperator = operatorId ? operator : profileData?.item
  if (!currentOperator) {
    console.error("ControllerContext Operator Missing")
  }
  return (
    <ControllerContext.Provider
      value={{ controllerDetailData, operator: currentOperator }}
    >
      {children}
    </ControllerContext.Provider>
  )
}
