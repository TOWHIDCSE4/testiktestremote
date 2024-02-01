import { T_BackendResponse, T_User } from "custom-validator"
import _ from "lodash"
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import useProfile from "../../../../hooks/users/useProfile"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: T_User
}

type T_ProductionEyeContext = {
  isMobile: boolean
  setIsMobile: (val: boolean) => void
  selectedLocationIds: Array<string>
  setSelectedLocationIds: (value: Array<string>) => void
  primaryLocationId: string | undefined
  primaryMachineClassId: string | undefined
  primaryFactoryId: string | undefined
  setPrimaryLocationId: (value?: string) => void
  setPrimaryMachineClassId: (value?: string) => void
  setPrimaryFactoryId: (value?: string) => void
  onSelectLocation: (id: string, checked: boolean) => void
  userProfile?: T_DBReturn
}

const defaultContextValues = {
  isMobile: false,
  setIsMobile: (val: boolean) => {},
  selectedLocationIds: [],
  setSelectedLocationIds: (value: Array<string>) => {},
  primaryLocationId: undefined,
  primaryMachineClassId: undefined,
  primaryFactoryId: undefined,
  setPrimaryLocationId: (val?: string) => {},
  setPrimaryMachineClassId: (val?: string) => {},
  setPrimaryFactoryId: (val?: string) => {},
  onSelectLocation: (id: string, checked: boolean) => {},
}

const productionEyeContext =
  createContext<T_ProductionEyeContext>(defaultContextValues)

export const useProductionEyeContext = () => useContext(productionEyeContext)

export default function ProductionEyeContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const { data: userProfile } = useProfile()

  const [selectedLocationIds, setSelectedLocationIds] = useState<Array<string>>(
    []
  )

  const [primaryLocationId, setPrimaryLocationId] = useState<
    string | undefined
  >()

  const [primaryMachineClassId, setPrimaryMachineClassId] = useState<
    string | undefined
  >()

  const [primaryFactoryId, setPrimaryFactoryId] = useState<string | undefined>()

  const onSelectLocation = (id: string, checked: boolean) => {
    setSelectedLocationIds((prev) =>
      checked
        ? _.uniq([...prev, id])
        : _.uniq([...prev.filter((item) => item !== id)])
    )
  }

  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    if (userProfile?.item?.locationId) {
      const userLocationId = userProfile?.item.locationId as string
      setPrimaryLocationId(userLocationId)
      onSelectLocation(userLocationId, true)
    }

    if (userProfile?.item?.machineClassId) {
      const userMachineClassId = userProfile?.item.machineClassId as string
      setPrimaryMachineClassId(userMachineClassId)
    }

    if (userProfile?.item?.factoryId) {
      const userFactoryId = userProfile?.item.factoryId as string
      setPrimaryFactoryId(userFactoryId)
    }
  }, [userProfile])

  return (
    <productionEyeContext.Provider
      value={{
        isMobile,
        setIsMobile,
        primaryLocationId,
        setPrimaryLocationId,
        primaryMachineClassId,
        setPrimaryMachineClassId,
        primaryFactoryId,
        setPrimaryFactoryId,
        selectedLocationIds,
        setSelectedLocationIds,
        onSelectLocation,
        userProfile,
      }}
    >
      {children}
    </productionEyeContext.Provider>
  )
}
