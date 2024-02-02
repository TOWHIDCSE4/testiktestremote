"use client"
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
  item: T_User & {
    defaultSettings?: {
      viewMode: string
      locations: string[]
      machineClasses: string[]
    }
  }
}

type T_ProductionEyeContext = {
  isMobile: string | undefined
  setIsMobile: (val: string) => void
  selectedLocationIds: Array<string>
  selectedMcIds: Array<string>
  setSelectedLocationIds: (value: Array<string>) => void
  setSelectedMcIds: (value: Array<string>) => void
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
  isMobile: "mobile",
  setIsMobile: (val: string) => {},
  selectedLocationIds: [],
  setSelectedLocationIds: (value: Array<string>) => {},
  primaryLocationId: undefined,
  primaryMachineClassId: undefined,
  primaryFactoryId: undefined,
  setPrimaryLocationId: (val?: string) => {},
  setPrimaryMachineClassId: (val?: string) => {},
  setPrimaryFactoryId: (val?: string) => {},
  onSelectLocation: (id: string, checked: boolean) => {},
  userProfile: undefined,
  selectedMcIds: [],
  setSelectedMcIds: (value: Array<string>) => {},
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

  const [selectedMcIds, setSelectedMcIds] = useState<Array<string>>([])

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

  const [isMobile, setIsMobile] = useState<string | undefined>()

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

    if (userProfile?.item?.defaultSettings?.viewMode) {
      const isMobile = userProfile?.item?.defaultSettings?.viewMode
      setIsMobile(isMobile)
    }

    if (userProfile?.item?.defaultSettings?.machineClasses) {
      const defaultMC = userProfile?.item?.defaultSettings?.machineClasses
      setSelectedMcIds(defaultMC)
    }

    if (Number(userProfile?.item?.defaultSettings?.locations.length) === 1) {
      const defaultLocations = userProfile?.item?.defaultSettings?.locations[0]
      setPrimaryLocationId(defaultLocations)
    }

    if (Number(userProfile?.item?.defaultSettings?.locations.length) > 1) {
      const defaultLocations = userProfile?.item?.defaultSettings?.locations
      setSelectedLocationIds(defaultLocations as string[])
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
        selectedMcIds,
        setSelectedMcIds,
      }}
    >
      {children}
    </productionEyeContext.Provider>
  )
}
